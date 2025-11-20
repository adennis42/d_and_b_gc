/**
 * API routes for project management
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * GET /api/projects - List all projects
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await sql`
      SELECT id, title, category, description, featured, "order", created_at, updated_at
      FROM projects
      ORDER BY "order" ASC, created_at DESC
    `;

    const projectsArray = Array.isArray(projects) ? projects : [];
    
    // Get first image for each project as thumbnail
    const projectsWithThumbnails = await Promise.all(
      projectsArray.map(async (project) => {
        const firstImage = await sql`
          SELECT url, alt
          FROM project_images
          WHERE project_id = ${project.id}
          ORDER BY "order" ASC
          LIMIT 1
        `;
        
        return {
          ...project,
          thumbnailUrl: Array.isArray(firstImage) && firstImage.length > 0 
            ? firstImage[0].url 
            : null,
          thumbnailAlt: Array.isArray(firstImage) && firstImage.length > 0 
            ? firstImage[0].alt 
            : null,
        };
      })
    );

    return NextResponse.json({ projects: projectsWithThumbnails });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects - Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, description, featured, order, images, videos } = body;

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['kitchen', 'bathroom', 'sunroom', 'millwork'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get max order value
    const maxOrderResult = await sql`
      SELECT COALESCE(MAX("order"), 0) as max_order FROM projects
    `;
    const maxOrder = Array.isArray(maxOrderResult) && maxOrderResult[0] 
      ? parseInt(maxOrderResult[0].max_order || '0', 10) 
      : 0;

    // Insert project
    const projectResult = await sql`
      INSERT INTO projects (title, category, description, featured, "order")
      VALUES (${title}, ${category}, ${description || null}, ${featured || false}, ${order ?? maxOrder + 1})
      RETURNING id, title, category, description, featured, "order"
    `;

    const project = Array.isArray(projectResult) ? projectResult[0] : projectResult;
    const projectId = project.id;

    // Insert images
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await sql`
          INSERT INTO project_images (project_id, url, alt, width, height, blur_data_url, "order")
          VALUES (${projectId}, ${img.url}, ${img.alt}, ${img.width}, ${img.height}, ${img.blurDataURL || null}, ${i})
        `;
      }
    }

    // Insert videos
    if (videos && Array.isArray(videos) && videos.length > 0) {
      for (let i = 0; i < videos.length; i++) {
        const vid = videos[i];
        await sql`
          INSERT INTO project_videos (project_id, video_id, alt, width, height, thumbnail_url, "order")
          VALUES (${projectId}, ${vid.videoId}, ${vid.alt}, ${vid.width}, ${vid.height}, ${vid.thumbnailUrl || null}, ${i})
        `;
      }
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}


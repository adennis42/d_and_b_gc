/**
 * API routes for individual project operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * GET /api/projects/[id] - Get a single project with images and videos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Get project
    const projectResult = await sql`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      WHERE id = ${projectId}
      LIMIT 1
    `;

    const projects = Array.isArray(projectResult) ? projectResult : [];
    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projects[0];

    // Get images
    const imagesResult = await sql`
      SELECT id, url, alt, width, height, blur_data_url, "order"
      FROM project_images
      WHERE project_id = ${projectId}
      ORDER BY "order" ASC
    `;

    // Get videos
    const videosResult = await sql`
      SELECT id, video_id, alt, width, height, thumbnail_url, "order"
      FROM project_videos
      WHERE project_id = ${projectId}
      ORDER BY "order" ASC
    `;

    const images = Array.isArray(imagesResult) ? imagesResult : [];
    const videos = Array.isArray(videosResult) ? videosResult : [];

    return NextResponse.json({
      ...project,
      images: images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        blurDataURL: img.blur_data_url,
        order: img.order,
      })),
      videos: videos.map(vid => ({
        id: vid.id,
        videoId: vid.video_id,
        alt: vid.alt,
        width: vid.width,
        height: vid.height,
        thumbnailUrl: vid.thumbnail_url,
        order: vid.order,
      })),
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id] - Update a project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await request.json();
    const { title, category, description, featured, order, images, videos } = body;

    // Validate category if provided
    if (category) {
      const validCategories = ['kitchen', 'bathroom', 'sunroom', 'millwork'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    // Update project
    await sql`
      UPDATE projects
      SET 
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        featured = COALESCE(${featured}, featured),
        "order" = COALESCE(${order}, "order"),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `;

    // Delete existing images and videos if new ones are provided
    if (images !== undefined) {
      await sql`DELETE FROM project_images WHERE project_id = ${projectId}`;
      
      // Insert new images
      if (Array.isArray(images) && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await sql`
            INSERT INTO project_images (project_id, url, alt, width, height, blur_data_url, "order")
            VALUES (${projectId}, ${img.url}, ${img.alt}, ${img.width}, ${img.height}, ${img.blurDataURL || null}, ${i})
          `;
        }
      }
    }

    if (videos !== undefined) {
      await sql`DELETE FROM project_videos WHERE project_id = ${projectId}`;
      
      // Insert new videos
      if (Array.isArray(videos) && videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const vid = videos[i];
          await sql`
            INSERT INTO project_videos (project_id, video_id, alt, width, height, thumbnail_url, "order")
            VALUES (${projectId}, ${vid.videoId}, ${vid.alt}, ${vid.width}, ${vid.height}, ${vid.thumbnailUrl || null}, ${i})
          `;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id] - Delete a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Delete project (cascade will delete images and videos)
    await sql`DELETE FROM projects WHERE id = ${projectId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}


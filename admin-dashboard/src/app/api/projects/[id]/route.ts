/**
 * API routes for individual project operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * GET /api/projects/[id] - Get a single project with images and videos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let projectId: string | undefined;

  try {
    const session = await auth();
    if (!session) {
      logger.warn('Project fetch attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    projectId = id;

    logger.operationStart('fetch project', {
      userId,
      userEmail,
      resourceId: projectId,
    });

    // Get project
    const projectResult = await sql`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      WHERE id = ${projectId}
      LIMIT 1
    `;

    const projects = Array.isArray(projectResult) ? projectResult : [];
    if (projects.length === 0) {
      logger.warn('Project not found', {
        userId,
        userEmail,
        resourceId: projectId,
      });
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

    const duration = Date.now() - startTime;
    logger.operationSuccess('fetch project', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        projectId,
        title: project.title,
        imageCount: images.length,
        videoCount: videos.length,
        durationMs: duration,
      },
    });

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
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('fetch project', err, {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: { durationMs: duration },
    });

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
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let projectId: string | undefined;

  try {
    const session = await auth();
    if (!session) {
      logger.warn('Project update attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    projectId = id;

    const body = await request.json();
    const { title, category, description, featured, order, images, videos } = body;

    logger.operationStart('update project', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        title,
        category,
        imageCount: images?.length,
        videoCount: videos?.length,
        hasImages: images !== undefined,
        hasVideos: videos !== undefined,
      },
    });

    // Validate required fields
    if (!title) {
      logger.warn('Project update failed: missing title', {
        userId,
        userEmail,
        resourceId: projectId,
      });
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['kitchen', 'bathroom', 'sunroom', 'millwork'];
      if (!validCategories.includes(category)) {
        logger.warn('Project update failed: invalid category', {
          userId,
          userEmail,
          resourceId: projectId,
          metadata: { category, validCategories },
        });
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    logger.debug('Updating project in database', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: { title, category },
    });

    // Update project - update all provided fields
    await sql`
      UPDATE projects
      SET 
        title = ${title},
        category = ${category},
        description = ${description || null},
        featured = ${featured || false},
        "order" = ${order || 0},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `;

    // Delete existing images and videos if new ones are provided
    if (images !== undefined) {
      logger.debug('Replacing project images', {
        userId,
        userEmail,
        resourceId: projectId,
        metadata: { newImageCount: images.length },
      });

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
      logger.debug('Replacing project videos', {
        userId,
        userEmail,
        resourceId: projectId,
        metadata: { newVideoCount: videos.length },
      });

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

    const duration = Date.now() - startTime;
    logger.operationSuccess('update project', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        projectId,
        title,
        category,
        imageCount: images?.length || 0,
        videoCount: videos?.length || 0,
        durationMs: duration,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('update project', err, {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        durationMs: duration,
        errorCode: error?.code,
      },
    });

    return NextResponse.json(
      { 
        error: 'Failed to update project',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
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
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let projectId: string | undefined;

  try {
    const session = await auth();
    if (!session) {
      logger.warn('Project deletion attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    projectId = id;

    // Get project info before deletion for logging
    const projectResult = await sql`
      SELECT id, title, category
      FROM projects
      WHERE id = ${projectId}
      LIMIT 1
    `;
    const project = Array.isArray(projectResult) && projectResult.length > 0 
      ? projectResult[0] 
      : null;

    logger.operationStart('delete project', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        projectTitle: project?.title,
        projectCategory: project?.category,
      },
    });

    if (!project) {
      logger.warn('Project not found for deletion', {
        userId,
        userEmail,
        resourceId: projectId,
      });
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (cascade will delete images and videos)
    await sql`DELETE FROM projects WHERE id = ${projectId}`;

    const duration = Date.now() - startTime;
    logger.operationSuccess('delete project', {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: {
        projectId,
        projectTitle: project.title,
        projectCategory: project.category,
        durationMs: duration,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('delete project', err, {
      userId,
      userEmail,
      resourceId: projectId,
      metadata: { durationMs: duration },
    });

    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}


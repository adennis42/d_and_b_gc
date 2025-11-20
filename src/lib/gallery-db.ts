/**
 * Database-backed gallery data functions
 * Replaces the static gallery-data.ts file
 * 
 * This module provides the same API as gallery-data.ts but reads from PostgreSQL
 * instead of a static TypeScript array.
 */

import { sql } from '@/lib/db';
import type { Project, Video } from '@/types';

interface ProjectRow {
  id: string;
  title: string;
  category: 'kitchen' | 'bathroom' | 'sunroom' | 'millwork';
  description: string | null;
  featured: boolean;
  order: number;
}

interface ImageRow {
  id: string;
  project_id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blur_data_url: string | null;
  order: number;
}

interface VideoRow {
  id: string;
  project_id: string;
  video_id: string;
  alt: string;
  width: number;
  height: number;
  thumbnail_url: string | null;
  order: number;
}

/**
 * Transform database rows into Project objects
 */
function transformProject(
  projectRow: ProjectRow,
  images: ImageRow[],
  videos: VideoRow[]
): Project {
  return {
    id: projectRow.id,
    title: projectRow.title,
    category: projectRow.category,
    description: projectRow.description || undefined,
    featured: projectRow.featured,
    images: images
      .sort((a, b) => a.order - b.order)
      .map((img) => ({
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        blurDataURL: img.blur_data_url || undefined,
      })),
    videos:
      videos.length > 0
        ? videos
            .sort((a, b) => a.order - b.order)
            .map((vid): Video => ({
              type: 'youtube',
              videoId: vid.video_id,
              alt: vid.alt,
              width: vid.width,
              height: vid.height,
              thumbnailUrl: vid.thumbnail_url || undefined,
            }))
        : undefined,
  };
}

/**
 * Get all projects from database
 * @returns Array of all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    // Fetch all projects ordered by their order field
    const projects = await sql<ProjectRow>`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      ORDER BY "order" ASC, created_at ASC
    `;

    // postgres package returns arrays directly
    const projectsArray = Array.isArray(projects) ? projects : [];
    if (projectsArray.length === 0) {
      return [];
    }

    const projectIds = projectsArray.map((p) => p.id);

    // Fetch all images for these projects
    const images = await sql<ImageRow>`
      SELECT id, project_id, url, alt, width, height, blur_data_url, "order"
      FROM project_images
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    // Fetch all videos for these projects
    const videos = await sql<VideoRow>`
      SELECT id, project_id, video_id, alt, width, height, thumbnail_url, "order"
      FROM project_videos
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    // Group images and videos by project_id
    const imagesByProject = new Map<string, ImageRow[]>();
    const videosByProject = new Map<string, VideoRow[]>();

    // postgres package returns arrays directly
    const imagesArray = Array.isArray(images) ? images : [];
    const videosArray = Array.isArray(videos) ? videos : [];

    for (const image of imagesArray) {
      if (!imagesByProject.has(image.project_id)) {
        imagesByProject.set(image.project_id, []);
      }
      imagesByProject.get(image.project_id)!.push(image);
    }

    for (const video of videosArray) {
      if (!videosByProject.has(video.project_id)) {
        videosByProject.set(video.project_id, []);
      }
      videosByProject.get(video.project_id)!.push(video);
    }

    // Transform to Project objects
    return projectsArray.map((project) =>
      transformProject(
        project,
        imagesByProject.get(project.id) || [],
        videosByProject.get(project.id) || []
      )
    );
  } catch (error) {
    console.error('Error fetching all projects:', error);
    // Fallback to empty array on error
    return [];
  }
}

/**
 * Get projects by category
 * @param category - Project category
 * @returns Array of projects matching the category
 */
export async function getProjectsByCategory(
  category: 'kitchen' | 'bathroom' | 'sunroom' | 'millwork'
): Promise<Project[]> {
  try {
    const projects = await sql<ProjectRow>`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      WHERE category = ${category}
      ORDER BY "order" ASC, created_at ASC
    `;

    // postgres package returns arrays directly
    const projectsArray = Array.isArray(projects) ? projects : [];
    if (projectsArray.length === 0) {
      return [];
    }

    const projectIds = projectsArray.map((p) => p.id);

    const images = await sql<ImageRow>`
      SELECT id, project_id, url, alt, width, height, blur_data_url, "order"
      FROM project_images
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    const videos = await sql<VideoRow>`
      SELECT id, project_id, video_id, alt, width, height, thumbnail_url, "order"
      FROM project_videos
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    const imagesByProject = new Map<string, ImageRow[]>();
    const videosByProject = new Map<string, VideoRow[]>();

    // postgres package returns arrays directly
    const imagesArray = Array.isArray(images) ? images : [];
    const videosArray = Array.isArray(videos) ? videos : [];

    for (const image of imagesArray) {
      if (!imagesByProject.has(image.project_id)) {
        imagesByProject.set(image.project_id, []);
      }
      imagesByProject.get(image.project_id)!.push(image);
    }

    for (const video of videosArray) {
      if (!videosByProject.has(video.project_id)) {
        videosByProject.set(video.project_id, []);
      }
      videosByProject.get(video.project_id)!.push(video);
    }

    return projectsArray.map((project) =>
      transformProject(
        project,
        imagesByProject.get(project.id) || [],
        videosByProject.get(project.id) || []
      )
    );
  } catch (error) {
    console.error(`Error fetching projects by category ${category}:`, error);
    return [];
  }
}

/**
 * Get featured projects
 * @returns Array of featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await sql<ProjectRow>`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      WHERE featured = true
      ORDER BY "order" ASC, created_at ASC
    `;

    // postgres package returns arrays directly
    const projectsArray = Array.isArray(projects) ? projects : [];
    if (projectsArray.length === 0) {
      return [];
    }

    const projectIds = projectsArray.map((p) => p.id);

    const images = await sql<ImageRow>`
      SELECT id, project_id, url, alt, width, height, blur_data_url, "order"
      FROM project_images
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    const videos = await sql<VideoRow>`
      SELECT id, project_id, video_id, alt, width, height, thumbnail_url, "order"
      FROM project_videos
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, "order" ASC
    `;

    const imagesByProject = new Map<string, ImageRow[]>();
    const videosByProject = new Map<string, VideoRow[]>();

    // postgres package returns arrays directly
    const imagesArray = Array.isArray(images) ? images : [];
    const videosArray = Array.isArray(videos) ? videos : [];

    for (const image of imagesArray) {
      if (!imagesByProject.has(image.project_id)) {
        imagesByProject.set(image.project_id, []);
      }
      imagesByProject.get(image.project_id)!.push(image);
    }

    for (const video of videosArray) {
      if (!videosByProject.has(video.project_id)) {
        videosByProject.set(video.project_id, []);
      }
      videosByProject.get(video.project_id)!.push(video);
    }

    return projectsArray.map((project) =>
      transformProject(
        project,
        imagesByProject.get(project.id) || [],
        videosByProject.get(project.id) || []
      )
    );
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

/**
 * Get a single project by ID
 * @param id - Project ID (UUID)
 * @returns Project if found, null otherwise
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projectResult = await sql<ProjectRow>`
      SELECT id, title, category, description, featured, "order"
      FROM projects
      WHERE id = ${id}
      LIMIT 1
    `;

    // postgres package returns arrays directly
    const projectsArray = Array.isArray(projectResult) ? projectResult : [];
    if (projectsArray.length === 0) {
      return null;
    }

    const project = projectsArray[0];

    const images = await sql<ImageRow>`
      SELECT id, project_id, url, alt, width, height, blur_data_url, "order"
      FROM project_images
      WHERE project_id = ${id}
      ORDER BY "order" ASC
    `;

    const videos = await sql<VideoRow>`
      SELECT id, project_id, video_id, alt, width, height, thumbnail_url, "order"
      FROM project_videos
      WHERE project_id = ${id}
      ORDER BY "order" ASC
    `;

    // postgres package returns arrays directly
    const imagesArray = Array.isArray(images) ? images : [];
    const videosArray = Array.isArray(videos) ? videos : [];
    return transformProject(project, imagesArray, videosArray);
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

/**
 * Get project categories with counts
 * @returns Object with category counts
 */
export async function getCategoryCounts(): Promise<{
  kitchen: number;
  bathroom: number;
  sunroom: number;
  millwork: number;
  total: number;
}> {
  try {
    const counts = await sql<{ category: string; count: string }>`
      SELECT category, COUNT(*) as count
      FROM projects
      GROUP BY category
    `;

    // postgres package returns arrays directly
    const countsArray = Array.isArray(counts) ? counts : [];
    const countsMap = new Map(
      countsArray.map((row) => [row.category, parseInt(row.count, 10)])
    );

    return {
      kitchen: countsMap.get('kitchen') || 0,
      bathroom: countsMap.get('bathroom') || 0,
      sunroom: countsMap.get('sunroom') || 0,
      millwork: countsMap.get('millwork') || 0,
      total: countsArray.reduce((sum, row) => sum + parseInt(row.count, 10), 0),
    };
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return {
      kitchen: 0,
      bathroom: 0,
      sunroom: 0,
      millwork: 0,
      total: 0,
    };
  }
}


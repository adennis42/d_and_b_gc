/**
 * Server component that loads gallery data from database
 * Fetches all projects and passes them to client components
 */

import { getAllProjects } from '@/lib/gallery-db';
import { GalleryPageContent } from './GalleryPageContent';
import type { Project } from '@/types';

/**
 * Force dynamic rendering to prevent caching
 * This ensures fresh data on every request
 */
export const dynamic = 'force-dynamic';

/**
 * Server component wrapper that fetches gallery data
 * This allows us to use async database queries while keeping
 * the interactive components as client components
 */
export async function GalleryDataLoader() {
  // Fetch all projects from database
  // This will always fetch fresh data due to force-dynamic
  const projects = await getAllProjects();

  return <GalleryPageContent initialProjects={projects} />;
}


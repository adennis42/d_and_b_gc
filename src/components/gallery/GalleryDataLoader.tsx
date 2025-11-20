/**
 * Server component that loads gallery data from database
 * Fetches all projects and passes them to client components
 */

import { getAllProjects } from '@/lib/gallery-db';
import { GalleryPageContent } from './GalleryPageContent';
import type { Project } from '@/types';

/**
 * Server component wrapper that fetches gallery data
 * This allows us to use async database queries while keeping
 * the interactive components as client components
 */
export async function GalleryDataLoader() {
  // Fetch all projects from database
  const projects = await getAllProjects();

  return <GalleryPageContent initialProjects={projects} />;
}


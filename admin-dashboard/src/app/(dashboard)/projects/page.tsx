"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  thumbnailUrl?: string | null;
  thumbnailAlt?: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects yet.</p>
            <Link href="/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="block hover:bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 mr-4">
                        {project.thumbnailUrl && !imageErrors.has(project.id) ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                            {/* Use regular img tag for local paths that might not exist, Next.js Image for external URLs */}
                            {project.thumbnailUrl.startsWith('http') ? (
                              <Image
                                src={project.thumbnailUrl}
                                alt={project.thumbnailAlt || project.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                                onError={() => {
                                  setImageErrors((prev) => new Set(prev).add(project.id));
                                }}
                              />
                            ) : (
                              // Use regular img for local paths to avoid Next.js optimization errors
                              <img
                                src={project.thumbnailUrl}
                                alt={project.thumbnailAlt || project.title}
                                className="w-full h-full object-cover"
                                onError={() => {
                                  setImageErrors((prev) => new Set(prev).add(project.id));
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center">
                            <span className="text-xs text-gray-400 text-center px-1">
                              {project.thumbnailUrl ? 'Error' : 'No image'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {project.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {project.title}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.category} • {new Date(project.created_at as string).toLocaleDateString()}
                        </div>
                        {project.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit project"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete project"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, FolderKanban } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
            Projects
          </h1>
          <p className="text-slate-400">Manage your gallery projects and images</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
            New Project
          </Button>
        </Link>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <FolderKanban className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 mb-2 font-medium">No projects yet</p>
            <p className="text-slate-500 text-sm mb-6">Get started by creating your first project</p>
            <Link href="/projects/new">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30">
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="block hover:bg-slate-800/50 transition-colors px-4 py-5 sm:px-6 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 mr-4">
                        {project.thumbnailUrl && !imageErrors.has(project.id) ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-sm group-hover:border-blue-500 transition-colors">
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
                          <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                            <span className="text-xs text-slate-500 text-center px-1 font-medium">
                              {project.thumbnailUrl ? 'Error' : 'No image'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {project.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                              ⭐ Featured
                            </span>
                          )}
                          <div className="text-base font-semibold text-slate-100 truncate">
                            {project.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium capitalize border border-slate-700">
                            {project.category}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span>{new Date(project.created_at as string).toLocaleDateString()}</span>
                        </div>
                        {project.description && (
                          <div className="text-sm text-slate-500 mt-1.5 line-clamp-1">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Edit project"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
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

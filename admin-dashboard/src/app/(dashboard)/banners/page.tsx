"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PromotionalBanner } from '@/lib/banners';

export default function BannersPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete banner');
      fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  };

  const handleToggleActive = async (banner: PromotionalBanner) => {
    try {
      const newActiveState = !banner.is_active;
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_active: newActiveState,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update banner');
      }
      fetchBanners();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update banner');
    }
  };

  const isCurrentlyActive = (banner: PromotionalBanner) => {
    if (!banner.is_active) return false;
    // Use a consistent date format to avoid hydration mismatches
    const today = new Date().toISOString().split('T')[0];
    const startDate = typeof banner.start_date === 'string' 
      ? banner.start_date.split('T')[0]
      : new Date(banner.start_date).toISOString().split('T')[0];
    const endDate = typeof banner.end_date === 'string'
      ? banner.end_date.split('T')[0]
      : new Date(banner.end_date).toISOString().split('T')[0];
    return today >= startDate && today <= endDate;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
              Promotional Banners
            </h1>
            <p className="text-slate-400">
              Manage promotional banners and special offers displayed on your website.
            </p>
          </div>
          <Button
            onClick={() => router.push('/banners/new')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Banner
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {banners.length === 0 ? (
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 mb-4">No banners created yet.</p>
              <Button
                onClick={() => router.push('/banners/new')}
                variant="outline"
              >
                Create Your First Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => {
              const active = isCurrentlyActive(banner);
              return (
                <Card
                  key={banner.id}
                  className={`bg-slate-900/80 backdrop-blur-sm border-slate-800 ${
                    active ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{banner.title}</CardTitle>
                          {active && (
                            <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded">
                              Active
                            </span>
                          )}
                          {!banner.is_active && (
                            <span className="px-2 py-1 text-xs font-semibold bg-slate-700 text-slate-400 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        {banner.description && (
                          <CardDescription className="text-slate-400 mt-2">
                            {banner.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {(() => {
                            // Use consistent date formatting to avoid hydration mismatches
                            const formatDate = (date: Date | string) => {
                              const d = typeof date === 'string' ? new Date(date) : date;
                              return d.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              });
                            };
                            return `${formatDate(banner.start_date)} - ${formatDate(banner.end_date)}`;
                          })()}
                        </span>
                      </div>
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: banner.background_color }}
                        title="Background color"
                      />
                      <span>{banner.is_dismissible ? 'Dismissible' : 'Always visible'}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/banners/${banner.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(banner)}
                      >
                        {banner.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-400 hover:text-red-300 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


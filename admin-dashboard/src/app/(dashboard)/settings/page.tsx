"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface HeroSettings {
  url: string;
  alt: string;
}

export default function SettingsPage() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    url: '',
    alt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const response = await fetch('/api/site-settings/hero');
      if (!response.ok) throw new Error('Failed to fetch hero settings');
      const data = await response.json();
      setHeroSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { url } = await response.json();
      setHeroSettings((prev) => ({ ...prev, url }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/site-settings/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroSettings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure site-wide settings including the homepage hero image.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 rounded-md">
            Settings saved successfully!
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
            <CardDescription>
              Configure the hero image displayed on the homepage. Recommended size: 1920x1080px or larger.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Preview */}
            {heroSettings.url && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={heroSettings.url}
                  alt={heroSettings.alt || 'Hero image preview'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Upload New Image */}
            <div className="space-y-2">
              <Label htmlFor="hero-upload">Upload Hero Image</Label>
              <Input
                id="hero-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="hero-url">Image URL</Label>
              <Input
                id="hero-url"
                type="url"
                value={heroSettings.url}
                onChange={(e) =>
                  setHeroSettings((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://example.com/image.jpg or /images/hero.jpg"
              />
              <p className="text-sm text-muted-foreground">
                Enter a URL or path to the hero image. You can upload an image above or use an existing URL.
              </p>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="hero-alt">Alt Text</Label>
              <Textarea
                id="hero-alt"
                value={heroSettings.alt}
                onChange={(e) =>
                  setHeroSettings((prev) => ({ ...prev, alt: e.target.value }))
                }
                placeholder="Beautiful kitchen and bathroom remodeling showcase"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Descriptive text for screen readers and SEO. Should describe what the image shows.
              </p>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={saving || !heroSettings.url}>
              {saving ? 'Saving...' : 'Save Hero Image Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


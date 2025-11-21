"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HeroSettings {
  url: string;
  alt: string;
  headline: string;
  subheadline: string;
  primaryCTA: { text: string; link: string };
  secondaryCTA: { text: string; link: string };
}

export default function SettingsPage() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    url: '',
    alt: '',
    headline: '',
    subheadline: '',
    primaryCTA: { text: '', link: '' },
    secondaryCTA: { text: '', link: '' },
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
      // Fetch hero image settings
      const imageResponse = await fetch('/api/site-settings/hero');
      if (!imageResponse.ok) throw new Error('Failed to fetch hero image settings');
      const imageData = await imageResponse.json();
      
      // Fetch hero text content
      const contentResponse = await fetch('/api/site-content/hero');
      if (!contentResponse.ok) throw new Error('Failed to fetch hero content');
      const contentData = await contentResponse.json();
      
      setHeroSettings({
        url: imageData.url || '',
        alt: imageData.alt || '',
        headline: contentData.headline || '',
        subheadline: contentData.subheadline || '',
        primaryCTA: contentData.primaryCTA || { text: '', link: '' },
        secondaryCTA: contentData.secondaryCTA || { text: '', link: '' },
      });
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
      // Save hero image settings
      const imageResponse = await fetch('/api/site-settings/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: heroSettings.url,
          alt: heroSettings.alt,
        }),
      });

      if (!imageResponse.ok) {
        const data = await imageResponse.json();
        throw new Error(data.error || 'Failed to save hero image settings');
      }

      // Save hero text content
      const contentResponse = await fetch('/api/site-content/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headline: heroSettings.headline,
          subheadline: heroSettings.subheadline,
          primaryCTA: heroSettings.primaryCTA,
          secondaryCTA: heroSettings.secondaryCTA,
        }),
      });

      if (!contentResponse.ok) {
        const data = await contentResponse.json();
        throw new Error(data.error || 'Failed to save hero content');
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
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
            Site Settings
          </h1>
          <p className="text-slate-400">
            Configure site-wide settings including the homepage hero image.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
            <span className="text-green-400">✓</span>
            Settings saved successfully!
          </div>
        )}

        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
            <CardDescription>
              Configure the hero image displayed on the homepage. Recommended size: 1920x1080px or larger.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Preview */}
            {heroSettings.url && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-slate-800">
                {heroSettings.url.startsWith('http') || heroSettings.url.startsWith('//') ? (
                  <div className="relative w-full h-full">
                    <img
                      src={heroSettings.url}
                      alt={heroSettings.alt || 'Hero image preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.error-message')) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'error-message flex items-center justify-center h-full text-slate-400';
                          errorDiv.innerHTML = `
                            <div class="text-center">
                              <p class="mb-2">⚠️ Failed to load image</p>
                              <p class="text-sm text-slate-500">URL: ${heroSettings.url}</p>
                              <p class="text-sm text-slate-500 mt-2">Please check the URL or upload a new image.</p>
                            </div>
                          `;
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <p className="mb-2">⚠️ Local path detected: {heroSettings.url}</p>
                      <p className="text-sm text-slate-500">
                        Use a full URL (starting with http:// or https://) or upload an image above.
                      </p>
                    </div>
                  </div>
                )}
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

            {/* Divider */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Hero Text Content</h3>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="hero-headline">Headline</Label>
              <Input
                id="hero-headline"
                type="text"
                value={heroSettings.headline}
                onChange={(e) =>
                  setHeroSettings((prev) => ({ ...prev, headline: e.target.value }))
                }
                placeholder="Transform Your Home with Expert Craftsmanship"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
              <p className="text-sm text-muted-foreground">
                Main headline displayed prominently on the hero section.
              </p>
            </div>

            {/* Subheadline */}
            <div className="space-y-2">
              <Label htmlFor="hero-subheadline">Subheadline</Label>
              <Textarea
                id="hero-subheadline"
                value={heroSettings.subheadline}
                onChange={(e) =>
                  setHeroSettings((prev) => ({ ...prev, subheadline: e.target.value }))
                }
                placeholder="Specializing in high-end kitchen and bathroom remodeling..."
                rows={3}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
              <p className="text-sm text-muted-foreground">
                Supporting text displayed below the headline.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-sm font-semibold text-slate-300">Primary Call-to-Action Button</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-cta-text">Button Text</Label>
                  <Input
                    id="primary-cta-text"
                    type="text"
                    value={heroSettings.primaryCTA.text}
                    onChange={(e) =>
                      setHeroSettings((prev) => ({
                        ...prev,
                        primaryCTA: { ...prev.primaryCTA, text: e.target.value },
                      }))
                    }
                    placeholder="View Our Work"
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-cta-link">Button Link</Label>
                  <Input
                    id="primary-cta-link"
                    type="text"
                    value={heroSettings.primaryCTA.link}
                    onChange={(e) =>
                      setHeroSettings((prev) => ({
                        ...prev,
                        primaryCTA: { ...prev.primaryCTA, link: e.target.value },
                      }))
                    }
                    placeholder="/gallery"
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-sm font-semibold text-slate-300">Secondary Call-to-Action Button</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondary-cta-text">Button Text</Label>
                  <Input
                    id="secondary-cta-text"
                    type="text"
                    value={heroSettings.secondaryCTA.text}
                    onChange={(e) =>
                      setHeroSettings((prev) => ({
                        ...prev,
                        secondaryCTA: { ...prev.secondaryCTA, text: e.target.value },
                      }))
                    }
                    placeholder="Schedule Consultation"
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-cta-link">Button Link</Label>
                  <Input
                    id="secondary-cta-link"
                    type="text"
                    value={heroSettings.secondaryCTA.link}
                    onChange={(e) =>
                      setHeroSettings((prev) => ({
                        ...prev,
                        secondaryCTA: { ...prev.secondaryCTA, link: e.target.value },
                      }))
                    }
                    placeholder="/schedule"
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave} 
              disabled={saving || !heroSettings.url}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
            >
              {saving ? 'Saving...' : 'Save Hero Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


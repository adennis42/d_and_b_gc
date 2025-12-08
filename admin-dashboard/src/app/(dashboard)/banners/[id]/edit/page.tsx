"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';
import type { PromotionalBanner } from '@/lib/banners';

// Popular Lucide icons for banners
const AVAILABLE_ICONS = [
  'Tag',
  'Gift',
  'Sparkles',
  'Star',
  'Zap',
  'TrendingUp',
  'Calendar',
  'Clock',
  'Percent',
  'DollarSign',
  'Award',
  'Trophy',
  'Heart',
  'Bell',
  'Megaphone',
  'AlertCircle',
  'Info',
  'CheckCircle',
  'Fire',
  'Rocket',
];

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: '',
    background_color: '#3B82F6',
    text_color: '#FFFFFF',
    button_text: '',
    button_link: '',
    button_color: '#FFFFFF',
    start_date: '',
    end_date: '',
    is_active: true,
    is_dismissible: true,
    show_countdown: false,
    ttl_days: null as number | null,
  });

  useEffect(() => {
    fetchBanner();
  }, [bannerId]);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/banners/${bannerId}`);
      if (!response.ok) throw new Error('Failed to fetch banner');
      const banner: PromotionalBanner = await response.json();
      
      setFormData({
        title: banner.title,
        description: banner.description || '',
        icon_name: banner.icon_name || '',
        background_color: banner.background_color,
        text_color: banner.text_color,
        button_text: banner.button_text || '',
        button_link: banner.button_link || '',
        button_color: banner.button_color,
        start_date: new Date(banner.start_date).toISOString().split('T')[0],
        end_date: new Date(banner.end_date).toISOString().split('T')[0],
        is_active: banner.is_active,
        is_dismissible: banner.is_dismissible,
        show_countdown: banner.show_countdown ?? false,
        ttl_days: banner.ttl_days ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load banner');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.title || !formData.start_date || !formData.end_date) {
        throw new Error('Title, start date, and end date are required');
      }

      const response = await fetch(`/api/banners/${bannerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          icon_name: formData.icon_name || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update banner');
      }

      router.push('/banners');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update banner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading banner...</p>
      </div>
    );
  }

  const IconComponent = formData.icon_name
    ? (LucideIcons[formData.icon_name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string; size?: number }>)
    : null;

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
            Edit Promotional Banner
          </h1>
          <p className="text-slate-400">
            Update your banner settings and preview changes.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle>Banner Content</CardTitle>
                  <CardDescription>Configure the text and appearance of your banner.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Design Fee Waived!"
                      required
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Book your consultation by December 31st and get your design fee waived!"
                      rows={3}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon_name || undefined}
                      onValueChange={(value) => setFormData({ ...formData, icon_name: value === 'none' ? '' : value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue placeholder="Select an icon (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="none" className="text-slate-100 hover:bg-slate-800 focus:bg-slate-800">None</SelectItem>
                        {AVAILABLE_ICONS.map((icon) => {
                          const Icon = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string; size?: number }>;
                          return (
                            <SelectItem key={icon} value={icon} className="text-slate-100 hover:bg-slate-800 focus:bg-slate-800">
                              <div className="flex items-center gap-2">
                                {Icon && <Icon className="w-4 h-4" />}
                                <span>{icon}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Customize the banner colors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="background_color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="background_color"
                          type="color"
                          value={formData.background_color}
                          onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                          className="h-10 w-20 p-1 bg-slate-800 border-slate-700"
                        />
                        <Input
                          type="text"
                          value={formData.background_color}
                          onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                          placeholder="#3B82F6"
                          className="flex-1 bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text_color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text_color"
                          type="color"
                          value={formData.text_color}
                          onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                          className="h-10 w-20 p-1 bg-slate-800 border-slate-700"
                        />
                        <Input
                          type="text"
                          value={formData.text_color}
                          onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                          placeholder="#FFFFFF"
                          className="flex-1 bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle>Call-to-Action Button</CardTitle>
                  <CardDescription>Add an optional button to your banner.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      placeholder="Learn More"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                      placeholder="/schedule"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button_color">Button Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="button_color"
                        type="color"
                        value={formData.button_color}
                        onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                        className="h-10 w-20 p-1 bg-slate-800 border-slate-700"
                      />
                      <Input
                        type="text"
                        value={formData.button_color}
                        onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                        placeholder="#FFFFFF"
                        className="flex-1 bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle>Visibility Settings</CardTitle>
                  <CardDescription>Control when and how the banner appears.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                        className="bg-slate-800 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked === true })
                      }
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Banner is active
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_dismissible"
                      checked={formData.is_dismissible}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_dismissible: checked === true })
                      }
                    />
                    <Label htmlFor="is_dismissible" className="cursor-pointer">
                      Allow visitors to dismiss banner
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show_countdown"
                      checked={formData.show_countdown}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, show_countdown: checked === true })
                      }
                    />
                    <Label htmlFor="show_countdown" className="cursor-pointer">
                      Show countdown timer (displays days remaining until end date)
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ttl_days">Auto-delete after end date (days, optional)</Label>
                    <Input
                      id="ttl_days"
                      type="number"
                      min="0"
                      placeholder="e.g., 7 (delete 7 days after end date)"
                      value={formData.ttl_days || ''}
                      onChange={(e) => setFormData({ ...formData, ttl_days: e.target.value ? parseInt(e.target.value) : null })}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                    <p className="text-xs text-slate-400">
                      Leave empty to keep banner indefinitely. Set number of days after end date to automatically delete.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className="lg:sticky lg:top-4 h-fit">
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how your banner will look on the website.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="w-full rounded-lg overflow-hidden border-2 border-slate-700"
                    style={{
                      backgroundColor: formData.background_color,
                      color: formData.text_color,
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <div className="flex-shrink-0">
                            <IconComponent className="w-5 h-5" size={20} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">
                            {formData.title || 'Banner Title'}
                          </h3>
                          {formData.description && (
                            <p className="text-xs opacity-90 line-clamp-2">
                              {formData.description}
                            </p>
                          )}
                        </div>
                        {formData.button_text && formData.button_link && (
                          <div className="flex-shrink-0">
                            <div
                              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium"
                              style={{
                                backgroundColor: formData.button_color,
                                color: formData.background_color,
                              }}
                            >
                              {formData.button_text}
                            </div>
                          </div>
                        )}
                        {formData.is_dismissible && (
                          <button className="flex-shrink-0 p-1 rounded-md hover:bg-black/10">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


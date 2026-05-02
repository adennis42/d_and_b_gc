"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BusinessInfo, ServiceItem, InstagramPost, AboutPreview, CtaContent } from '@/lib/site-content';

// ─── Types ─────────────────────────────────────────────────────────────────

interface HeroSettings {
  url: string;
  alt: string;
  headline: string;
  subheadline: string;
  primaryCTA: { text: string; link: string };
}

type Tab = 'business' | 'hero' | 'services' | 'instagram' | 'about' | 'cta';

const TABS: { id: Tab; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Services' },
  { id: 'instagram', label: 'Instagram Grid' },
  { id: 'about', label: 'About' },
  { id: 'cta', label: 'CTA' },
];

// ─── Image Upload Helper ────────────────────────────────────────────────────

function useImageUpload(onSuccess: (url: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      const { url } = await res.json();
      onSuccess(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}

// ─── Image Upload Field ─────────────────────────────────────────────────────

function ImageField({
  label,
  imageUrl,
  onUrlChange,
  description,
}: {
  label: string;
  imageUrl: string | null;
  onUrlChange: (url: string) => void;
  description?: string;
}) {
  const { upload, uploading } = useImageUpload(onUrlChange);

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <label className="flex-1">
          <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm cursor-pointer hover:bg-slate-700 transition-colors">
            {uploading ? 'Uploading…' : imageUrl ? 'Replace Image' : 'Upload Image'}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
        {imageUrl && (
          <button
            onClick={() => onUrlChange('')}
            className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}

// ─── Status Banner ──────────────────────────────────────────────────────────

function StatusBanner({ error, success }: { error: string | null; success: boolean }) {
  if (error) return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
      ⚠️ {error}
    </div>
  );
  if (success) return (
    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
      ✓ Saved successfully!
    </div>
  );
  return null;
}

// ─── Business Tab ───────────────────────────────────────────────────────────

function BusinessTab() {
  const [data, setData] = useState<BusinessInfo>({ name: '', phone: '', email: '', instagramUrl: '', city: '', state: '', zip: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/business').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/site-content/business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  const field = (id: keyof BusinessInfo, label: string, placeholder: string, type = 'text') => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={data[id]} onChange={e => setData(p => ({ ...p, [id]: e.target.value }))} placeholder={placeholder} className="bg-slate-800 border-slate-700 text-slate-100" />
    </div>
  );

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>Your business name, contact details, and social links — shown in the header, footer, and SEO metadata.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <StatusBanner error={error} success={success} />
        {field('name', 'Business Name', 'Raise Design & Build')}
        {field('phone', 'Phone Number', '(555) 123-4567', 'tel')}
        {field('email', 'Email Address', 'info@example.com', 'email')}
        {field('instagramUrl', 'Instagram URL', 'https://instagram.com/youraccount', 'url')}
        <div className="grid grid-cols-3 gap-4">
          {field('city', 'City', 'Bay Shore')}
          {field('state', 'State', 'NY')}
          {field('zip', 'ZIP Code', '11706')}
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Business Info'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Hero Tab ───────────────────────────────────────────────────────────────

function HeroTab() {
  const [data, setData] = useState<HeroSettings>({ url: '', alt: '', headline: '', subheadline: '', primaryCTA: { text: '', link: '' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/site-settings/hero').then(r => r.json()),
      fetch('/api/site-content/hero').then(r => r.json()),
    ]).then(([img, content]) => {
      setData({ url: img.url || '', alt: img.alt || '', headline: content.headline || '', subheadline: content.subheadline || '', primaryCTA: content.primaryCTA || { text: '', link: '' } });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      await Promise.all([
        fetch('/api/site-settings/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: data.url, alt: data.alt }) }).then(r => { if (!r.ok) throw new Error('Failed to save hero image'); }),
        fetch('/api/site-content/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ headline: data.headline, subheadline: data.subheadline, primaryCTA: data.primaryCTA }) }).then(r => { if (!r.ok) throw new Error('Failed to save hero content'); }),
      ]);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>The full-screen section at the top of the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <StatusBanner error={error} success={success} />
        <ImageField label="Hero Image" imageUrl={data.url} onUrlChange={url => setData(p => ({ ...p, url }))} description="Recommended: 1920×1080px or larger. Displayed full-screen behind the headline." />
        <div className="space-y-2">
          <Label htmlFor="hero-alt">Image Alt Text</Label>
          <Input id="hero-alt" value={data.alt} onChange={e => setData(p => ({ ...p, alt: e.target.value }))} placeholder="Describe the image for accessibility" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="border-t border-slate-700 pt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-headline">Headline</Label>
            <Input id="hero-headline" value={data.headline} onChange={e => setData(p => ({ ...p, headline: e.target.value }))} placeholder="Transform Your Home with Expert Craftsmanship" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-sub">Subheadline</Label>
            <Textarea id="hero-sub" value={data.subheadline} onChange={e => setData(p => ({ ...p, subheadline: e.target.value }))} rows={3} placeholder="Supporting text below the headline" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
            <p className="text-sm font-semibold text-slate-300">Call-to-Action Button</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={data.primaryCTA.text} onChange={e => setData(p => ({ ...p, primaryCTA: { ...p.primaryCTA, text: e.target.value } }))} placeholder="Schedule Consultation" className="bg-slate-800 border-slate-700 text-slate-100" />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input value={data.primaryCTA.link} onChange={e => setData(p => ({ ...p, primaryCTA: { ...p.primaryCTA, link: e.target.value } }))} placeholder="/schedule" className="bg-slate-800 border-slate-700 text-slate-100" />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Hero Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Services Tab ───────────────────────────────────────────────────────────

function ServicesTab() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/services').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/site-content/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const update = (i: number, patch: Partial<ServiceItem>) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>Services</CardTitle>
        <CardDescription>The four service cards shown on the homepage. Upload a photo for each service.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatusBanner error={error} success={success} />
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-slate-800/40 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={item.tagline} onChange={e => update(i, { tagline: e.target.value })} placeholder="Beautiful, functional spaces" className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>
            <ImageField label="Service Image" imageUrl={item.imageUrl} onUrlChange={url => update(i, { imageUrl: url })} description="Portrait image works best (4:5 ratio)" />
            <div className="space-y-2">
              <Label>Image Alt Text</Label>
              <Input value={item.imageAlt} onChange={e => update(i, { imageAlt: e.target.value })} placeholder={`${item.title} project photo`} className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>
          </div>
        ))}
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Services'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Instagram Grid Tab ─────────────────────────────────────────────────────

function InstagramTab() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/instagram').then(r => r.json()).then(d => { setPosts(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/site-content/instagram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(posts) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const update = (i: number, patch: Partial<InstagramPost>) => setPosts(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>Instagram Grid</CardTitle>
        <CardDescription>Six curated photos shown in the "Our Work" section. Each links to your Instagram profile or a specific post.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusBanner error={error} success={success} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post, i) => (
            <div key={i} className="p-4 bg-slate-800/40 rounded-lg border border-slate-700 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Photo {i + 1}</p>
              <ImageField label="Photo" imageUrl={post.imageUrl} onUrlChange={url => update(i, { imageUrl: url })} />
              <div className="space-y-2">
                <Label>Caption (optional)</Label>
                <Input value={post.caption} onChange={e => update(i, { caption: e.target.value })} placeholder="Kitchen remodel in Bay Shore, NY" className="bg-slate-800 border-slate-700 text-slate-100 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Link (Instagram post or profile URL)</Label>
                <Input value={post.permalink} onChange={e => update(i, { permalink: e.target.value })} placeholder="https://instagram.com/p/..." className="bg-slate-800 border-slate-700 text-slate-100 text-sm" />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Instagram Grid'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── About Tab ──────────────────────────────────────────────────────────────

function AboutTab() {
  const [data, setData] = useState<AboutPreview>({ imageUrl: null, imageAlt: '', heading: '', bodyText: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/about-preview').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/site-content/about-preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>About Preview</CardTitle>
        <CardDescription>The split-screen about section on the homepage — photo on one side, text on the other.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <StatusBanner error={error} success={success} />
        <ImageField label="About Photo" imageUrl={data.imageUrl} onUrlChange={url => setData(p => ({ ...p, imageUrl: url }))} description="Landscape image (4:3 ratio recommended)" />
        <div className="space-y-2">
          <Label>Image Alt Text</Label>
          <Input value={data.imageAlt} onChange={e => setData(p => ({ ...p, imageAlt: e.target.value }))} placeholder="Our team working on a kitchen remodel" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input value={data.heading} onChange={e => setData(p => ({ ...p, heading: e.target.value }))} placeholder="Design-First Approach" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Body Text</Label>
          <Textarea value={data.bodyText} onChange={e => setData(p => ({ ...p, bodyText: e.target.value }))} rows={4} placeholder="Describe your approach, expertise, or what makes you different." className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save About Section'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── CTA Tab ─────────────────────────────────────────────────────────────────

function CtaTab() {
  const [data, setData] = useState<CtaContent>({ heading: '', bodyText: '', buttonText: '', buttonLink: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/cta').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/site-content/cta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>Call to Action</CardTitle>
        <CardDescription>The bottom section encouraging visitors to get in touch.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <StatusBanner error={error} success={success} />
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input value={data.heading} onChange={e => setData(p => ({ ...p, heading: e.target.value }))} placeholder="Ready to Start Your Project?" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Body Text</Label>
          <Textarea value={data.bodyText} onChange={e => setData(p => ({ ...p, bodyText: e.target.value }))} rows={3} placeholder="Schedule a free consultation to discuss your remodeling vision" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input value={data.buttonText} onChange={e => setData(p => ({ ...p, buttonText: e.target.value }))} placeholder="Schedule Your Consultation" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input value={data.buttonLink} onChange={e => setData(p => ({ ...p, buttonLink: e.target.value }))} placeholder="/schedule" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save CTA Section'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('business');

  const tabContent: Record<Tab, React.ReactNode> = {
    business: <BusinessTab />,
    hero: <HeroTab />,
    services: <ServicesTab />,
    instagram: <InstagramTab />,
    about: <AboutTab />,
    cta: <CtaTab />,
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
          Site Settings
        </h1>
        <p className="text-slate-400">Configure every piece of content on the public website.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[80px] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {tabContent[activeTab]}
    </div>
  );
}

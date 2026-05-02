"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BusinessInfo, ServiceItem, InstagramPost, AboutPreview, CtaContent } from '@/lib/site-content';

// ─── Types ─────────────────────────────────────────────────────────────────

type Tab = 'business' | 'hero' | 'instagram' | 'about' | 'cta';

const TABS: { id: Tab; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'hero', label: 'Hero' },
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
  const [data, setData] = useState<BusinessInfo>({ name: '', phone: '', email: '', city: '', state: '', zip: '', instagramUrl: '', facebookUrl: '', pinterestUrl: '', serviceAreas: [], hours: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/business').then(r => r.json()).then((d: any) => {
      // Fully reconstruct from named fields only — never spread unknown objects
      // This prevents character-indexed string spreading
      setData({
        name: d?.name || '',
        phone: d?.phone || '',
        email: d?.email || '',
        city: d?.city || '',
        state: d?.state || '',
        zip: d?.zip || '',
        instagramUrl: d?.instagramUrl || '',
        facebookUrl: d?.facebookUrl || '',
        pinterestUrl: d?.pinterestUrl || '',
        serviceAreas: Array.isArray(d?.serviceAreas) ? d.serviceAreas : [],
        hours: d?.hours || '',
      });
      setLoading(false);
    });
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
        {field('hours', 'Business Hours', 'Mon–Fri 8am–5pm, Sat 9am–1pm')}
        <div className="grid grid-cols-3 gap-4">
          {field('city', 'City', 'Bay Shore')}
          {field('state', 'State', 'NY')}
          {field('zip', 'ZIP Code', '11706')}
        </div>
        <div className="space-y-2">
          <Label>Service Areas</Label>
          <p className="text-xs text-slate-500">One town/area per line</p>
          <textarea
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-md p-2 text-sm"
            value={(data.serviceAreas || []).join('\n')}
            onChange={e => setData(p => ({ ...p, serviceAreas: e.target.value.split('\n').filter(s => s.trim().length > 0) }))}
            placeholder={"East Islip\nBay Shore\nIslip\nCentral Islip"}
          />
        </div>
        <div className="border-t border-slate-700 pt-4 space-y-4">
          <p className="text-sm font-semibold text-slate-300">Social Media Links</p>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <span>📸</span> Instagram
            </Label>
            <Input value={data.instagramUrl} onChange={e => setData(p => ({ ...p, instagramUrl: e.target.value }))} placeholder="https://instagram.com/youraccount" type="url" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <span>📘</span> Facebook
            </Label>
            <Input value={data.facebookUrl} onChange={e => setData(p => ({ ...p, facebookUrl: e.target.value }))} placeholder="https://facebook.com/yourpage" type="url" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <span>📌</span> Pinterest
            </Label>
            <Input value={data.pinterestUrl} onChange={e => setData(p => ({ ...p, pinterestUrl: e.target.value }))} placeholder="https://pinterest.com/youraccount" type="url" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Business Info'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Hero Tab ───────────────────────────────────────────────────────────────

interface HeroFormData {
  url: string; alt: string;
  headlineLine1: string; headlineLine2: string; headlineLine3: string;
  eyebrow: string; creditLine: string;
  primaryCTA: { text: string; link: string };
}

function HeroTab() {
  const [data, setData] = useState<HeroFormData>({
    url: '', alt: '',
    headlineLine1: 'Craftsmanship', headlineLine2: 'at every', headlineLine3: 'detail.',
    eyebrow: 'Kitchens · Baths · Sunrooms · Millwork',
    creditLine: 'Long Island, New York — Est. 2003',
    primaryCTA: { text: 'Schedule a Visit', link: '/schedule' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/site-settings/hero').then(r => r.json()),
      fetch('/api/site-content/hero').then(r => r.json()),
    ]).then(([img, content]: [any, any]) => {
      setData({
        url: img?.url || '',
        alt: img?.alt || '',
        headlineLine1: content?.headlineLine1 || 'Craftsmanship',
        headlineLine2: content?.headlineLine2 || 'at every',
        headlineLine3: content?.headlineLine3 || 'detail.',
        eyebrow: content?.eyebrow || 'Kitchens · Baths · Sunrooms · Millwork',
        creditLine: content?.creditLine || 'Long Island, New York — Est. 2003',
        primaryCTA: content?.primaryCTA || { text: 'Schedule a Visit', link: '/schedule' },
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      await Promise.all([
        fetch('/api/site-settings/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: data.url, alt: data.alt }) }).then(r => { if (!r.ok) throw new Error('Failed to save hero image'); }),
        fetch('/api/site-content/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          headlineLine1: data.headlineLine1, headlineLine2: data.headlineLine2, headlineLine3: data.headlineLine3,
          eyebrow: data.eyebrow, creditLine: data.creditLine, primaryCTA: data.primaryCTA,
        }) }).then(r => { if (!r.ok) throw new Error('Failed to save hero content'); }),
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
          <p className="text-xs text-slate-400">The headline displays on 3 lines. Each line is a separate field below.</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hero-line1">Headline Line 1</Label>
              <Input id="hero-line1" value={data.headlineLine1} onChange={e => setData(p => ({ ...p, headlineLine1: e.target.value }))} placeholder="Craftsmanship" className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-line2">Headline Line 2</Label>
              <Input id="hero-line2" value={data.headlineLine2} onChange={e => setData(p => ({ ...p, headlineLine2: e.target.value }))} placeholder="at every" className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-line3">Headline Line 3</Label>
              <Input id="hero-line3" value={data.headlineLine3} onChange={e => setData(p => ({ ...p, headlineLine3: e.target.value }))} placeholder="detail." className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-eyebrow">Eyebrow Text (small text above headline)</Label>
            <Input id="hero-eyebrow" value={data.eyebrow} onChange={e => setData(p => ({ ...p, eyebrow: e.target.value }))} placeholder="Kitchens · Baths · Sunrooms · Millwork" className="bg-slate-800 border-slate-700 text-slate-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-credit">Credit Line (vertical text, right side)</Label>
            <Input id="hero-credit" value={data.creditLine} onChange={e => setData(p => ({ ...p, creditLine: e.target.value }))} placeholder="Long Island, New York — Est. 2003" className="bg-slate-800 border-slate-700 text-slate-100" />
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
  const [data, setData] = useState<AboutPreview>({
    imageUrl: null, imageAlt: '',
    headline: '', homeBlurb: '', bodyParagraphs: [''], teamNames: [], serviceAreas: [],
  });
  const [teamNamesText, setTeamNamesText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content/about-preview').then(r => r.json()).then((d: any) => {
      const teamNames = Array.isArray(d?.teamNames) ? d.teamNames : [];
      const bodyParagraphs = Array.isArray(d?.bodyParagraphs) ? d.bodyParagraphs : [d?.bodyText || ''].filter(Boolean);
      setData({
        imageUrl: d?.imageUrl || null,
        imageAlt: d?.imageAlt || '',
        headline: d?.headline || '',
        homeBlurb: d?.homeBlurb || '',
        bodyParagraphs,
        teamNames,
        serviceAreas: Array.isArray(d?.serviceAreas) ? d.serviceAreas : [],
      });
      setTeamNamesText(teamNames.join('\n'));
      setBodyText(bodyParagraphs.join('\n\n'));
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    // Convert raw text areas to arrays on save
    const teamNames = teamNamesText.split('\n').filter(s => s.trim().length > 0);
    const bodyParagraphs = bodyText.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
    const payload = { ...data, teamNames, bodyParagraphs };
    try {
      const res = await fetch('/api/site-content/about-preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading…</p>;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800">
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>The split-screen section on the homepage — photo on one side, text on the other.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <StatusBanner error={error} success={success} />
        <ImageField label="About Photo" imageUrl={data.imageUrl} onUrlChange={url => setData(p => ({ ...p, imageUrl: url }))} description="Portrait or landscape image" />
        <div className="space-y-2">
          <Label>Image Alt Text</Label>
          <Input value={data.imageAlt} onChange={e => setData(p => ({ ...p, imageAlt: e.target.value }))} placeholder="Our team working on a kitchen remodel" className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input value={data.headline} onChange={e => setData(p => ({ ...p, headline: e.target.value }))} placeholder="Craft-forward remodeling on Long Island." className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Home Page Blurb</Label>
          <p className="text-xs text-slate-500">Short 1-2 sentence teaser shown on the home page only. Does not affect the full story on /about.</p>
          <Textarea value={data.homeBlurb} onChange={e => setData(p => ({ ...p, homeBlurb: e.target.value }))} rows={3} placeholder="A family-owned remodeling company serving Long Island since 2003..." className="bg-slate-800 border-slate-700 text-slate-100" />
        </div>
        <div className="space-y-2">
          <Label>Full Story (About Page Only)</Label>
          <p className="text-xs text-slate-500">One paragraph per line — double blank line between paragraphs</p>
          <Textarea
            value={bodyText}
            onChange={e => setBodyText(e.target.value)}
            rows={5}
            placeholder={"Paragraph 1\n\nParagraph 2"}
            className="bg-slate-800 border-slate-700 text-slate-100"
          />
        </div>
        <div className="space-y-2">
          <Label>Team Names</Label>
          <p className="text-xs text-slate-500">One name per line</p>
          <Textarea
            value={teamNamesText}
            onChange={e => setTeamNamesText(e.target.value)}
            rows={4}
            placeholder={"Paul Sr.\nPaul Jr.\nJessica"}
            className="bg-slate-800 border-slate-700 text-slate-100"
          />
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

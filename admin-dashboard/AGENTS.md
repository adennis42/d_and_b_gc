# AGENTS.md — Raise Design & Build Admin Dashboard

## Overview
The admin dashboard is a **separate Next.js app** (`admin-dashboard/`) that lets the site owner manage all configurable content on the main website without touching code. It shares the same Postgres database as the main site.

- **Local dev URL:** http://localhost:3001
- **Production:** Separate Vercel project (root dir: `admin-dashboard`)
- **Auth:** NextAuth (credentials-based login)
- **Database:** Vercel Postgres (shared with main site via `POSTGRES_URL`)
- **File storage:** Vercel Blob (`BLOB_READ_WRITE_TOKEN`)

---

## What Should Be Configurable (Source of Truth)

All of the following should be editable through the admin portal:

### 1. Hero Section
- **Hero image** — upload + preview (Vercel Blob)
- **Hero image alt text**
- **Headline** (3-line editorial display heading)
- **Eyebrow text** (small text above the headline)
- **Primary CTA button** — text + link

### 2. Services (4 Cards)
One entry per service: **Kitchens · Bathrooms · Sunrooms · Millwork**
- **Title**
- **Description** (1–2 sentences)
- **Image** — upload + preview (4:5 portrait ratio)
- **Link** (href)

### 3. About Section (on /about page)
- **About image** — upload + preview
- **Headline**
- **Body text / bio** (rich text or plain paragraphs)
- **Team names** (Paul Sr., Paul Jr., Jessica — can be plain text fields)
- **Service areas** — list of towns/areas served (add/remove items)

### 4. Social Media
- **Instagram URL** — links to their Instagram profile
- **Facebook URL** (optional)
- **Other social links** (optional)
- **Instagram grid images** — up to 9 images shown in the footer/home, uploaded manually (fallback when Instagram API not connected)

### 5. Business Info
- **Business name**
- **Phone number**
- **Email address**
- **Address** (street, city, state, zip)
- **Service areas** — list of towns served (shown in footer, SEO schema)
- **Business hours**

### 6. CTA Section (bottom of home page)
- **Headline** (with optional brass italic emphasis)
- **Button 1** — text + link
- **Button 2** — text + link (optional)

---

## Tech Stack
- **Framework:** Next.js 15 (App Router), TypeScript
- **UI:** Tailwind CSS + Shadcn UI components
- **Auth:** NextAuth.js (`/api/auth/[...nextauth]`)
- **Database:** Vercel Postgres via `postgres` npm package (NOT Prisma)
- **File uploads:** Vercel Blob via `/api/upload` route
- **State:** React Hook Form + local useState

## File Structure
```
admin-dashboard/
  src/
    app/
      (dashboard)/
        settings/page.tsx     ← Main settings UI (tabs: Business/Hero/Services/Instagram/About/CTA)
        banners/              ← Promotional banner management
        projects/             ← Project gallery management
        analytics/            ← Analytics view
      api/
        site-content/
          hero/route.ts       ← GET/POST hero text content
          services/route.ts   ← GET/POST services cards
          about-preview/route.ts ← GET/POST about section
          instagram/route.ts  ← GET/POST instagram grid images
          cta/route.ts        ← GET/POST CTA section
          business/route.ts   ← GET/POST business info
        site-settings/
          hero/route.ts       ← GET/POST hero image URL + alt
        upload/route.ts       ← POST image to Vercel Blob
    lib/
      db.ts                   ← Postgres client (lazy init, uses POSTGRES_URL)
      site-content.ts         ← Types + DB query functions for site content
```

## Database Schema (site_content table)
All configurable content lives in a `site_content` table with key-value structure:
```sql
CREATE TABLE site_content (
  key VARCHAR PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```
Keys used:
- `hero_image` — `{ url, alt }`
- `hero_content` — `{ headline, subheadline, eyebrow, primaryCTA: { text, link } }`
- `services` — `ServiceItem[]`
- `about_preview` — `{ image, headline, body, teamNames, serviceAreas }`
- `instagram_posts` — `InstagramPost[]`
- `cta_content` — `{ heading, bodyText, buttonText, buttonLink }`
- `business_info` — `{ name, phone, email, address, serviceAreas, hours, socialLinks }`

## Current State
The settings page (`/settings`) has tabs for:
- **Business** — name, phone, email, address, hours
- **Hero** — image upload + headline/subheadline/CTA text
- **Services** — 4 service card images + text
- **Instagram** — manual image grid upload
- **About** — about image + text
- **CTA** — CTA section text

## What Needs Building / Updating

### Missing from current settings UI:
1. **Social media links** — Instagram URL, Facebook URL (separate from the image grid)
2. **Service areas list** — add/remove text items for both About and Business tabs
3. **Hero eyebrow text** — small italic text above headline (currently hardcoded)
4. **About team names** — editable names for Paul Sr., Paul Jr., Jessica
5. **Services link field** — each service card needs a configurable href

### Main site needs to READ from DB for:
- Services section — images + text (currently hardcoded in `Services.tsx`)
- About section — image + text (currently hardcoded in `About.tsx` or similar)
- Hero eyebrow text (currently hardcoded)
- Social links in Header/Footer (currently from env vars only)
- Service areas in Footer (currently from env vars only)

## Agent Rules
1. Read this file first
2. The main site reads content via `src/lib/site-content.ts` functions — update those when adding new content keys
3. The admin dashboard writes via API routes in `src/app/api/site-content/`
4. Never hardcode business content in main site components — always read from DB
5. Use Vercel Blob for all image uploads (never store base64 in DB)
6. Build both apps after changes: `bun run build` in each directory
7. Push to `main` branch — Vercel auto-deploys
8. Admin dashboard is deployed as a **separate Vercel project** with root dir `admin-dashboard`

## Environment Variables Required
```
# Both apps need:
POSTGRES_URL=

# Admin dashboard only:
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
BLOB_READ_WRITE_TOKEN=

# Main site only:
NEXT_PUBLIC_BUSINESS_NAME=
NEXT_PUBLIC_BUSINESS_PHONE=
NEXT_PUBLIC_BUSINESS_EMAIL=
NEXT_PUBLIC_INSTAGRAM_URL=
```

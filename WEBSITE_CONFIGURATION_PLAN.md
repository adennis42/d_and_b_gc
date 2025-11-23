# Website Configuration Plan

Plan to make the main website fully configurable through the admin dashboard.

## Overview

Transform hardcoded content into database-driven, configurable content that clients can manage through the admin dashboard.

---

## Configuration Areas

### 1. Hero Section ✅ (Partially Complete)
- [x] Hero image URL
- [x] Hero image alt text
- [ ] Headline text
- [ ] Subheadline text
- [ ] Primary CTA button text
- [ ] Primary CTA button link
- [ ] Secondary CTA button text
- [ ] Secondary CTA button link

### 2. Services Section
- [ ] Section title
- [ ] Section description
- [ ] Service items (dynamic list):
  - Service title
  - Service description
  - Service features (array)
  - Service icon (optional)

### 3. About Section (Homepage)
- [ ] Section title
- [ ] Section description
- [ ] CTA button text
- [ ] CTA button link

### 4. CTA Section
- [ ] Section title
- [ ] Section description
- [ ] Primary CTA button text
- [ ] Primary CTA button link
- [ ] Secondary CTA button text
- [ ] Secondary CTA button link

### 5. Site-Wide Settings
- [ ] Business name
- [ ] Business tagline/description
- [ ] Business phone
- [ ] Business email
- [ ] Business address
- [ ] Social media links (Facebook, Instagram, etc.)
- [ ] Business hours

### 6. Footer
- [ ] Footer description
- [ ] Footer links (dynamic)
- [ ] Copyright text

---

## Database Schema Updates

### New Tables/Fields Needed

1. **site_content** table (for structured content):
   ```sql
   CREATE TABLE site_content (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     section VARCHAR(100) NOT NULL, -- 'hero', 'services', 'about', 'cta'
     key VARCHAR(100) NOT NULL, -- 'headline', 'subheadline', etc.
     value JSONB NOT NULL, -- Flexible JSON structure
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(section, key)
   );
   ```

2. **Extend site_settings** table (for simple key-value pairs):
   - Already exists, can add more settings

---

## Implementation Phases

### Phase 1: Hero Section Configuration ✅ (In Progress)
- [x] Database functions for hero image
- [x] Admin dashboard UI for hero image
- [ ] Database functions for hero text content
- [ ] Admin dashboard UI for hero text content
- [ ] Update Hero component to use database content

### Phase 2: Services Section Configuration
- [ ] Create database functions for services
- [ ] Create admin dashboard UI for services
- [ ] Update Services component to use database content

### Phase 3: About & CTA Sections
- [ ] Create database functions
- [ ] Create admin dashboard UI
- [ ] Update components

### Phase 4: Site-Wide Settings
- [ ] Create database functions
- [ ] Create admin dashboard UI
- [ ] Update components to use settings

---

## API Routes Needed

### Main Website API Routes
- `GET /api/site-content/[section]` - Get content for a section
- `GET /api/site-content` - Get all content

### Admin Dashboard API Routes
- `GET /api/site-content/[section]` - Get content for editing
- `POST /api/site-content/[section]` - Update content
- `GET /api/site-settings` - Get all settings
- `POST /api/site-settings` - Update settings

---

## Component Updates Needed

1. **Hero.tsx** - Accept props from database
2. **Services.tsx** - Fetch services from database
3. **CTA.tsx** - Fetch CTA content from database
4. **page.tsx** - Fetch About section content
5. **Footer.tsx** - Fetch footer content
6. **Header.tsx** - Fetch business name

---

## Admin Dashboard UI Updates

### Settings Page Sections:
1. **Hero Section**
   - Image upload/URL
   - Headline text editor
   - Subheadline text editor
   - CTA buttons configuration

2. **Services Section**
   - Add/remove services
   - Edit service details
   - Reorder services

3. **Content Sections**
   - About section editor
   - CTA section editor

4. **Site Settings**
   - Business information
   - Contact information
   - Social media links

---

## Data Structure Examples

### Hero Section Content:
```json
{
  "headline": "Transform Your Home with Expert Craftsmanship",
  "subheadline": "Specializing in high-end kitchen and bathroom remodeling...",
  "primaryCTA": {
    "text": "View Our Work",
    "link": "/gallery"
  },
  "secondaryCTA": {
    "text": "Schedule Consultation",
    "link": "/schedule"
  }
}
```

### Services Content:
```json
[
  {
    "title": "Kitchen Remodeling",
    "description": "Transform your kitchen...",
    "features": ["Custom cabinetry", "Premium appliances", ...],
    "icon": "ChefHat"
  },
  {
    "title": "Bathroom Remodeling",
    "description": "Create a luxurious bathroom...",
    "features": ["Custom tile work", "Luxury fixtures", ...],
    "icon": "Droplet"
  }
]
```

---

## Migration Strategy

1. **Backward Compatibility**: Keep default values in components
2. **Gradual Migration**: Make components check database first, fallback to defaults
3. **Data Migration**: Create script to migrate hardcoded content to database

---

## Next Steps

1. Create database schema for site_content
2. Create API routes for content management
3. Update components to fetch from database
4. Create admin dashboard UI for content editing
5. Test end-to-end functionality


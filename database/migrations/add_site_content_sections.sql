-- Migration: Add default site content sections
-- Run this once against the production database

INSERT INTO site_content (section, key, value, description) VALUES
  ('business', 'info', '{
    "name": "Raise Design & Build",
    "phone": "",
    "email": "",
    "instagramUrl": "",
    "city": "",
    "state": "",
    "zip": ""
  }'::jsonb, 'Business contact and identity information')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO site_content (section, key, value, description) VALUES
  ('services', 'items', '[
    {"title": "Kitchen Remodeling", "tagline": "Beautiful, functional spaces", "imageUrl": null, "imageAlt": ""},
    {"title": "Bathroom Remodeling", "tagline": "Luxurious retreats", "imageUrl": null, "imageAlt": ""},
    {"title": "Millwork", "tagline": "Custom craftsmanship", "imageUrl": null, "imageAlt": ""},
    {"title": "Sunrooms", "tagline": "Bright, airy additions", "imageUrl": null, "imageAlt": ""}
  ]'::jsonb, 'Service cards displayed on the homepage')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO site_content (section, key, value, description) VALUES
  ('instagram', 'posts', '[
    {"imageUrl": null, "caption": "", "permalink": ""},
    {"imageUrl": null, "caption": "", "permalink": ""},
    {"imageUrl": null, "caption": "", "permalink": ""},
    {"imageUrl": null, "caption": "", "permalink": ""},
    {"imageUrl": null, "caption": "", "permalink": ""},
    {"imageUrl": null, "caption": "", "permalink": ""}
  ]'::jsonb, 'Curated photos shown in the Instagram grid section')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO site_content (section, key, value, description) VALUES
  ('about', 'preview', '{
    "imageUrl": null,
    "imageAlt": "",
    "heading": "Design-First Approach",
    "bodyText": "We transform high-end residential spaces with meticulous attention to detail and expert craftsmanship."
  }'::jsonb, 'About preview section on the homepage')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO site_content (section, key, value, description) VALUES
  ('cta', 'content', '{
    "heading": "Ready to Start Your Project?",
    "bodyText": "Schedule a free consultation to discuss your remodeling vision",
    "buttonText": "Schedule Your Consultation",
    "buttonLink": "/schedule"
  }'::jsonb, 'Call-to-action section at the bottom of the homepage')
ON CONFLICT (section, key) DO NOTHING;

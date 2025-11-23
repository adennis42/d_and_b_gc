# Promotional Banner System Plan

## Overview
Create a customizable banner system that allows clients to add promotional banners (specials, offers, announcements) with full control over appearance and visibility duration.

## Features

### Banner Properties
- **Text Content**: Customizable headline and description
- **Colors**: Background color, text color, button color
- **Icons**: Select from icon library (Lucide React)
- **Duration**: Start date and end date for automatic visibility
- **Link**: Optional CTA button with custom link
- **Status**: Active/Inactive toggle

### Admin Dashboard
- Create new banners
- Edit existing banners
- Delete banners
- Preview banners
- See active/inactive status
- Date-based visibility indicators

### Main Website
- Display active banners (based on current date)
- Show only one banner at a time (most recent active)
- Dismissible banner option
- Responsive design
- Smooth animations

## Database Schema

```sql
CREATE TABLE promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100), -- Lucide icon name
  background_color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
  text_color VARCHAR(7) DEFAULT '#FFFFFF', -- Hex color
  button_text VARCHAR(100),
  button_link VARCHAR(500),
  button_color VARCHAR(7) DEFAULT '#FFFFFF', -- Hex color
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_dismissible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Steps

1. Database schema and migrations
2. Banner component for main website
3. API routes for CRUD operations
4. Admin dashboard UI for banner management
5. Icon selector component
6. Color picker component
7. Date picker for duration


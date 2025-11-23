-- Migration: Add show_countdown field to promotional_banners table
-- This allows banners to optionally display a countdown timer showing days remaining

ALTER TABLE promotional_banners
ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN promotional_banners.show_countdown IS 'If true, displays a countdown showing days remaining until end_date. On the final day, displays "Last Day!" instead of "1 day remaining".';


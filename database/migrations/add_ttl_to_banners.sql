-- Migration: Add ttl_days field to promotional_banners table
-- This allows banners to be automatically deleted after a specified number of days past their end_date

ALTER TABLE promotional_banners
ADD COLUMN IF NOT EXISTS ttl_days INTEGER NULL;

-- Add comment to explain the field
COMMENT ON COLUMN promotional_banners.ttl_days IS 'Number of days after end_date to automatically delete the banner. NULL means never auto-delete.';


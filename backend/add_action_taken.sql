-- Add action_taken column to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS action_taken TEXT;

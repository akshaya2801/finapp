-- Run this SQL directly in Neon Console
-- Go to: https://console.neon.tech → Your Project → SQL Editor

-- Add rating and feedback columns
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'tickets' 
AND column_name IN ('rating', 'feedback');

-- You should see:
-- rating   | integer | YES
-- feedback | text    | YES

-- Phase 1: Add cigs_added column to consumptions table
ALTER TABLE public.consumptions 
ADD COLUMN cigs_added DECIMAL(4,2) DEFAULT 0;

COMMENT ON COLUMN public.consumptions.cigs_added IS 'Number of cigarettes included in this cannabis/hash consumption (decimal supported, e.g., 1.5)';

-- Create index for better performance on queries filtering by cigs_added
CREATE INDEX idx_consumptions_cigs_added ON public.consumptions(cigs_added) WHERE cigs_added > 0;

-- Update existing data: find auto-generated cigarette entries and merge them
-- This will set cigs_added on cannabis/hash entries that have corresponding cigarette entries
WITH cigarette_entries AS (
  SELECT 
    id,
    user_id,
    quantity,
    date,
    created_at
  FROM public.consumptions
  WHERE type = 'cigarette'
    AND note LIKE '%Ajoutées automatiquement%'
),
cannabis_entries AS (
  SELECT 
    c.id,
    c.user_id,
    c.date,
    c.created_at,
    cig.quantity as cig_quantity
  FROM public.consumptions c
  LEFT JOIN cigarette_entries cig 
    ON c.user_id = cig.user_id
    AND DATE(c.created_at) = DATE(cig.created_at)
    AND ABS(EXTRACT(EPOCH FROM (c.created_at - cig.created_at))) < 5
  WHERE c.type IN ('herbe', 'hash')
    AND cig.id IS NOT NULL
)
UPDATE public.consumptions
SET cigs_added = CAST(REGEXP_REPLACE(cannabis_entries.cig_quantity, '[^0-9.]', '', 'g') AS DECIMAL(4,2))
FROM cannabis_entries
WHERE consumptions.id = cannabis_entries.id;

-- Delete auto-generated cigarette entries that have been merged
DELETE FROM public.consumptions
WHERE type = 'cigarette'
  AND note LIKE '%Ajoutées automatiquement%';
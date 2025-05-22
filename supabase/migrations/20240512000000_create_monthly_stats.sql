-- Create monthly_stats table
CREATE TABLE IF NOT EXISTS public.monthly_stats (
  month TIMESTAMPTZ PRIMARY KEY,
  users INTEGER NOT NULL DEFAULT 0,
  reports INTEGER NOT NULL DEFAULT 0,
  awards INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.monthly_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to authenticated users
CREATE POLICY "Enable read access for all users" 
ON public.monthly_stats
FOR SELECT
USING (true);

-- Create policy to allow insert/update for service role
CREATE POLICY "Enable insert for service role only"
ON public.monthly_stats
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Enable update for service role only"
ON public.monthly_stats
FOR UPDATE
TO service_role
USING (true);

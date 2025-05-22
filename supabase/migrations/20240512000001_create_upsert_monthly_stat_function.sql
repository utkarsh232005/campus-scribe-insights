-- Create or replace function to upsert monthly stats
CREATE OR REPLACE FUNCTION public.upsert_monthly_stat(
  p_month TIMESTAMPTZ,
  p_users INTEGER,
  p_reports INTEGER,
  p_awards INTEGER
) RETURNS void AS $$
BEGIN
  INSERT INTO public.monthly_stats (month, users, reports, awards, updated_at)
  VALUES (p_month, p_users, p_reports, p_awards, NOW())
  ON CONFLICT (month) 
  DO UPDATE SET
    users = EXCLUDED.users,
    reports = EXCLUDED.reports,
    awards = EXCLUDED.awards,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

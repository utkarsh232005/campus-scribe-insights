-- Create monthly_stats table
CREATE TABLE IF NOT EXISTS monthly_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month DATE NOT NULL,
    users INTEGER DEFAULT 0,
    reports INTEGER DEFAULT 0,
    awards INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on month for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_stats_month ON monthly_stats(month);

-- Enable RLS
ALTER TABLE monthly_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON monthly_stats
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON monthly_stats
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON monthly_stats
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create function to update monthly stats
CREATE OR REPLACE FUNCTION update_monthly_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update users count
    UPDATE monthly_stats
    SET users = (
        SELECT COUNT(*)
        FROM profiles
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NEW.created_at)
    )
    WHERE month = DATE_TRUNC('month', NEW.created_at);

    -- Update reports count
    UPDATE monthly_stats
    SET reports = (
        SELECT COUNT(*)
        FROM reports
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NEW.created_at)
    )
    WHERE month = DATE_TRUNC('month', NEW.created_at);

    -- Update awards count
    UPDATE monthly_stats
    SET awards = (
        SELECT COUNT(*)
        FROM awards
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NEW.created_at)
    )
    WHERE month = DATE_TRUNC('month', NEW.created_at);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_monthly_stats_profiles
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_stats();

CREATE TRIGGER update_monthly_stats_reports
    AFTER INSERT OR UPDATE OR DELETE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_stats();

CREATE TRIGGER update_monthly_stats_awards
    AFTER INSERT OR UPDATE OR DELETE ON awards
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_stats();

-- Insert initial data for the last 12 months
INSERT INTO monthly_stats (month, users, reports, awards)
SELECT 
    generate_series(
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
        DATE_TRUNC('month', CURRENT_DATE),
        '1 month'::interval
    )::date as month,
    0 as users,
    0 as reports,
    0 as awards
ON CONFLICT (month) DO NOTHING; 
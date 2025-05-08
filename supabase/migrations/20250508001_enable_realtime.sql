
-- Create or replace a function to enable realtime for tables
CREATE OR REPLACE FUNCTION public.enable_realtime_for_table(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Attempt to enable realtime for the specified table
  -- This is a no-op if the table is already enabled
  BEGIN
    EXECUTE format(
      'ALTER PUBLICATION supabase_realtime ADD TABLE %I',
      table_name
    );
    RETURN true;
  EXCEPTION WHEN OTHERS THEN
    -- If the table is already in the publication, that's fine
    RETURN true;
  END;
END;
$$;

-- Enable Row Level Security for notifications table if not already enabled
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting notifications (replacing IF NOT EXISTS which is not supported)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Anyone can insert notifications'
  ) THEN
    CREATE POLICY "Anyone can insert notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);
  END IF;
END
$$;

-- Create policy for users to view their own or broadcast notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (user_id = auth.uid() OR user_id IS NULL);
  END IF;
END
$$;

-- Add notifications table to realtime publication
-- Using DO block to safely handle this
DO $$
BEGIN
  -- Check if the table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'notifications'
  ) THEN
    -- Try to add it
    BEGIN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE notifications';
    EXCEPTION WHEN OTHERS THEN
      -- If it fails, that's okay, likely already added or publication doesn't exist
      NULL;
    END;
  END IF;
END
$$;

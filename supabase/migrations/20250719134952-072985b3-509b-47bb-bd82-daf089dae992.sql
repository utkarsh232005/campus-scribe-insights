
-- Create a table for draft reports
CREATE TABLE public.report_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  publication_count INTEGER DEFAULT 0,
  conference_count INTEGER DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  funding_amount NUMERIC DEFAULT 0,
  achievements TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.report_drafts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own drafts
CREATE POLICY "Users can view their own drafts" 
  ON public.report_drafts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own drafts
CREATE POLICY "Users can create their own drafts" 
  ON public.report_drafts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own drafts
CREATE POLICY "Users can update their own drafts" 
  ON public.report_drafts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own drafts
CREATE POLICY "Users can delete their own drafts" 
  ON public.report_drafts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable real-time updates for the table
ALTER PUBLICATION supabase_realtime ADD TABLE report_drafts;
ALTER TABLE report_drafts REPLICA IDENTITY FULL;

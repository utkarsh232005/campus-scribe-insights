
-- Create a storage bucket for faculty profile photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'faculty-photos',
  'Faculty Profile Photos',
  true,
  5242880, -- 5MB
  '{image/png,image/jpeg,image/jpg,image/gif}'
);

-- Create a policy that allows everyone to read files from this bucket
create policy "Public can view faculty photos"
on storage.objects for select
using ( bucket_id = 'faculty-photos' );

-- Create a policy that allows only authenticated users to insert files
create policy "Authenticated users can upload faculty photos"
on storage.objects for insert
with check ( 
  bucket_id = 'faculty-photos' AND 
  auth.role() = 'authenticated'
);

-- Create a policy that allows only the uploader to update and delete their own files
create policy "Users can update and delete their own faculty photos"
on storage.objects for update, delete
using (
  bucket_id = 'faculty-photos' AND
  auth.uid() = owner
);

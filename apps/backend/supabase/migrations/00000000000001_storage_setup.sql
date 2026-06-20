-- Setup Supabase Storage Buckets
insert into storage.buckets (id, name, public) values ('product-files', 'product-files', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('eco-files', 'eco-files', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('user-avatars', 'user-avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('report-exports', 'report-exports', false) on conflict do nothing;

-- Enable Row Level Security
alter table storage.objects enable row level security;

-- Policies for product-files (Authenticated Read/Write)
create policy "Authenticated users can read product files" on storage.objects for select using ( bucket_id = 'product-files' and auth.role() = 'authenticated' );
create policy "Authenticated users can insert product files" on storage.objects for insert with check ( bucket_id = 'product-files' and auth.role() = 'authenticated' );
create policy "Authenticated users can update product files" on storage.objects for update using ( bucket_id = 'product-files' and auth.role() = 'authenticated' );

-- Policies for eco-files
create policy "Authenticated users can read eco files" on storage.objects for select using ( bucket_id = 'eco-files' and auth.role() = 'authenticated' );
create policy "Authenticated users can insert eco files" on storage.objects for insert with check ( bucket_id = 'eco-files' and auth.role() = 'authenticated' );

-- Policies for user-avatars (Public Read)
create policy "Public can read avatars" on storage.objects for select using ( bucket_id = 'user-avatars' );
create policy "Authenticated users can insert avatars" on storage.objects for insert with check ( bucket_id = 'user-avatars' and auth.role() = 'authenticated' );

-- Policies for report-exports (Authenticated Read/Write)
create policy "Authenticated users can read report exports" on storage.objects for select using ( bucket_id = 'report-exports' and auth.role() = 'authenticated' );
create policy "Authenticated users can insert report exports" on storage.objects for insert with check ( bucket_id = 'report-exports' and auth.role() = 'authenticated' );

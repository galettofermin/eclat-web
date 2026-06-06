create table if not exists site_images (
  key        text        primary key,
  url        text        not null,
  updated_at timestamptz default now()
);

alter table site_images enable row level security;

create policy "public read" on site_images for select using (true);
create policy "auth all"    on site_images for all to authenticated using (true) with check (true);

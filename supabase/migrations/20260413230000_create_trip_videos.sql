-- Trip videos table for the /trip-videos page
create table if not exists trip_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  youtube_id text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS: public read, admin write
alter table trip_videos enable row level security;

create policy "Anyone can read active videos"
  on trip_videos for select
  using (is_active = true);

create policy "Service role has full access to videos"
  on trip_videos for all
  using (auth.role() = 'service_role');

-- Seed with placeholder data (replace youtube_ids with real ones)
insert into trip_videos (title, description, youtube_id, display_order) values
  (
    'Full Day Deep Sea Trip — Blue Marlin Strike',
    'Follow along on a 12-hour deep sea trip as the crew hooks up on a 400lb blue marlin off Charleston.',
    'dQw4w9WgXcQ',
    1
  ),
  (
    'Overnight Gulf Stream Swordfish Adventure',
    'Our overnight Gulf Stream trip in action. Night fishing for broadbill swordfish 80 miles offshore.',
    'dQw4w9WgXcQ',
    2
  ),
  (
    'Mahi-Mahi Frenzy on the Weed Line',
    'Nonstop mahi-mahi action along a productive Gulf Stream weed line. Limit out in under 2 hours.',
    'dQw4w9WgXcQ',
    3
  );

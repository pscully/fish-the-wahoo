-- Fish The Wahoo — seed data
-- Run after migrations: supabase db push && supabase db reset --db-url ...
-- Or paste directly into Supabase SQL editor.
--
-- UUID key:
--   Boat classes:    a0000000-0000-0000-0000-00000000000{1,2,3}
--   Trip durations:  b0000000-0000-0000-0000-00000000000{2,3,4}  (6h/9h/12h)

-- ============================================================
-- Boat Classes
-- ============================================================
insert into boat_classes (id, name, slug, tagline, description, min_feet, max_feet, max_passengers, image_url, display_order)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    '48-50 Foot Class Sportfisher',
    '48-50-foot-class',
    'Reliable, fast, and fully equipped',
    'Still a super smooth ride, but considerably more economical. Ideal for serious anglers looking for a great day on the water without the premium price tag. All gear, bait, and tackle included.',
    48, 50, 6,
    '/images/fishing-charters-000.webp',
    1
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '53-59 Foot Class Sportfisher',
    '53-59-foot-class',
    'The perfect balance of comfort and performance',
    'A little more expensive than the 50-foot class, but a little bigger also. Advanced fish-finding technology, spacious deck space, and a smooth ride offshore. Our most popular vessel class.',
    53, 59, 6,
    '/images/fishing-charters-001.webp',
    2
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '60+ Foot Class Sportfisher',
    '60-plus-foot-class',
    'The biggest, smoothest, best-riding boats in Charleston',
    'Consider this the Emperor package. Biggest, smoothest, best-riding boats in Charleston. Full AC cabin, full galley, satellite TV, fighting chair, and premium tackle. For those who want the absolute best.',
    60, 72, 6,
    '/images/fishing-charters-002.webp',
    3
  )
on conflict (id) do nothing;

-- ============================================================
-- Trip Durations
-- ============================================================
insert into trip_durations (id, name, slug, hours, time_description, display_order)
values
  ('b0000000-0000-0000-0000-000000000002', '6-Hour Trip',      '6-hour',  6,  '6:00 AM – 12:00 PM', 1),
  ('b0000000-0000-0000-0000-000000000003', '9-Hour Trip',      '9-hour',  9,  '6:00 AM – 3:00 PM',  2),
  ('b0000000-0000-0000-0000-000000000004', '12-Hour Full Day', '12-hour', 12, '5:00 AM – 5:00 PM',  3)
on conflict (id) do nothing;

-- ============================================================
-- Pricing  (total_price and deposit_amount in cents)
-- Deposit is 10% of total, per owner direction. Balance to captain on trip day.
-- Prices sourced from fishthewahoo.com/packages-and-prices.
-- Note: 6-hour (half day) is only listed on the 48-50 class per the WP site
-- ("bottom fishing only — offshore runs need 9+ hours"). Larger classes
-- are 9h and 12h only.
-- ============================================================
insert into pricing (boat_class_id, trip_duration_id, total_price, deposit_amount)
values
  -- 48-50 ft
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 280000, 28000),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 310000, 31000),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 340000, 34000),
  -- 53-59 ft
  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 390000, 39000),
  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 430000, 43000),
  -- 60+ ft
  ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 570000, 57000),
  ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 620000, 62000)
on conflict (boat_class_id, trip_duration_id) do nothing;

-- ============================================================
-- Trip Videos (replace youtube_id values with real ones)
-- ============================================================
insert into trip_videos (title, description, youtube_id, display_order)
values
  (
    'Full Day Deep Sea — Blue Marlin Strike',
    'Follow along on a 12-hour deep sea trip as the crew hooks up on a trophy blue marlin off Charleston, SC.',
    'REPLACE_WITH_REAL_ID',
    1
  ),
  (
    'Overnight Gulf Stream Swordfish Adventure',
    'Night fishing for broadbill swordfish 80 miles offshore. The overnight Gulf Stream experience.',
    'REPLACE_WITH_REAL_ID',
    2
  ),
  (
    'Mahi-Mahi Frenzy on the Weed Line',
    'Nonstop mahi-mahi action along a productive Gulf Stream weed line. Limit out in under 2 hours.',
    'REPLACE_WITH_REAL_ID',
    3
  )
on conflict do nothing;

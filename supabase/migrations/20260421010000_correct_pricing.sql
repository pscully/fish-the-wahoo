-- Correct pricing to match fishthewahoo.com/packages-and-prices and switch
-- deposits to 10% of total (per owner direction, April 2026).
--
-- Trip duration IDs:
--   b0000000-0000-0000-0000-000000000002 = 6-Hour (half day)
--   b0000000-0000-0000-0000-000000000003 = 9-Hour (3/4 day)
--   b0000000-0000-0000-0000-000000000004 = 12-Hour (full day)
--
-- Boat class IDs:
--   a0000000-0000-0000-0000-000000000001 = 48-50 ft
--   a0000000-0000-0000-0000-000000000002 = 53-59 ft
--   a0000000-0000-0000-0000-000000000003 = 60+ ft

-- The 6-hour (half day) is bottom-fishing only on the 48-50 class.
-- Delete any 6-hour pricing rows on larger classes so the booking flow can't
-- offer a combination the business doesn't sell.
delete from pricing
where trip_duration_id = 'b0000000-0000-0000-0000-000000000002'
  and boat_class_id in (
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003'
  );

-- 48-50 class
update pricing set total_price = 280000, deposit_amount = 28000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000002';
update pricing set total_price = 310000, deposit_amount = 31000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 340000, deposit_amount = 34000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

-- 53-59 class
update pricing set total_price = 390000, deposit_amount = 39000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000002'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 430000, deposit_amount = 43000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000002'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

-- 60+ class
update pricing set total_price = 570000, deposit_amount = 57000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000003'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 620000, deposit_amount = 62000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000003'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

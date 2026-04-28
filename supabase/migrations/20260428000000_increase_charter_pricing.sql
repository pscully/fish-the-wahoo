-- Increase every fishing charter total by $40000 cents ($400) across the board,
-- per owner direction (April 2026). Deposits remain 10% of total.
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

-- 48-50 class
update pricing set total_price = 320000, deposit_amount = 32000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000002';
update pricing set total_price = 350000, deposit_amount = 35000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 380000, deposit_amount = 38000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000001'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

-- 53-59 class
update pricing set total_price = 430000, deposit_amount = 43000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000002'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 470000, deposit_amount = 47000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000002'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

-- 60+ class
update pricing set total_price = 610000, deposit_amount = 61000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000003'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000003';
update pricing set total_price = 660000, deposit_amount = 66000
  where boat_class_id = 'a0000000-0000-0000-0000-000000000003'
    and trip_duration_id = 'b0000000-0000-0000-0000-000000000004';

-- Retire 4-Hour and Overnight trip durations.
-- The business only sells 6h (1/2 day), 9h (3/4 day), and 12h (full day) trips.

delete from pricing
where trip_duration_id in (
  'b0000000-0000-0000-0000-000000000001', -- 4-Hour Trip
  'b0000000-0000-0000-0000-000000000005'  -- Overnight Gulf Stream
);

delete from trip_durations
where id in (
  'b0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000005'
);

-- Re-sequence display_order so the three remaining rows are 1,2,3.
update trip_durations set display_order = 1 where id = 'b0000000-0000-0000-0000-000000000002';
update trip_durations set display_order = 2 where id = 'b0000000-0000-0000-0000-000000000003';
update trip_durations set display_order = 3 where id = 'b0000000-0000-0000-0000-000000000004';

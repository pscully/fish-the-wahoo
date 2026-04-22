-- Booking rebuild (April 2026): add preferred/backup date fields.
-- The `time_slot` column already exists on `bookings` and stores '06:00'
-- or '12:00' for 6-hour half-day trips (empty string otherwise).

alter table bookings
  add column if not exists backup_date date,
  add column if not exists backup_date_notes text not null default '';

-- The original schema included a permissive anonymous UPDATE policy that let
-- the browser flip payment_status from pending → paid. In the new flow that
-- transition only happens server-side via the Stripe webhook (service role),
-- so the anon UPDATE path is no longer needed and is actively risky.
drop policy if exists "Anon can update own booking payment" on bookings;

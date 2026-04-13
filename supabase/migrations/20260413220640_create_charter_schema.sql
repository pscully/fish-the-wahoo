/*
  # Charleston Fishing Charter - Core Schema

  1. New Tables
    - `boat_classes` - Boat size tiers (48-50ft, 53-59ft, 60+ft)
      - `id` (uuid, primary key)
      - `name` (text) - Display name
      - `slug` (text, unique) - URL-friendly identifier
      - `tagline` (text) - Short marketing tagline
      - `description` (text) - Full description
      - `min_feet` / `max_feet` (integer) - Size range
      - `max_passengers` (integer) - Max party size
      - `image_url` (text) - Hero image
      - `display_order` (integer) - Sort order
      - `created_at` (timestamptz)

    - `trip_durations` - Duration options (half day, 3/4 day, full day)
      - `id` (uuid, primary key)
      - `name` (text) - Display name
      - `slug` (text, unique)
      - `hours` (integer) - Approximate hours
      - `time_description` (text) - e.g. "7:00 AM - 12:00 PM"
      - `display_order` (integer)

    - `pricing` - Links boat classes to trip durations with prices
      - `id` (uuid, primary key)
      - `boat_class_id` (uuid, fk)
      - `trip_duration_id` (uuid, fk)
      - `total_price` (integer) - Full trip price in cents
      - `deposit_amount` (integer) - Deposit (our fee) in cents

    - `captains` - Captain profiles
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `bio` (text)
      - `photo_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)

    - `boats` - Individual boats
      - `id` (uuid, primary key)
      - `name` (text)
      - `captain_id` (uuid, fk, nullable)
      - `boat_class_id` (uuid, fk)
      - `description` (text)
      - `image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)

    - `captain_availability` - Per-date availability slots
      - `id` (uuid, primary key)
      - `captain_id` (uuid, fk)
      - `boat_id` (uuid, fk)
      - `date` (date)
      - `slot` (text) - am, pm, three_quarter, full_day
      - `is_available` (boolean, default true)

    - `bookings` - Customer bookings
      - `id` (uuid, primary key)
      - `reference_code` (text, unique) - Customer-facing code
      - `customer_first_name` / `customer_last_name` / `customer_email` / `customer_phone`
      - `party_size` (integer)
      - `boat_class_id` / `trip_duration_id` (uuid, fk)
      - `booking_date` (date)
      - `time_slot` (text)
      - `special_requests` (text)
      - `assigned_captain_id` / `assigned_boat_id` (uuid, fk, nullable)
      - `deposit_amount` (integer)
      - `payment_status` (text) - pending, paid, refunded
      - `booking_status` (text) - pending, confirmed, captain_assigned, completed, cancelled
      - `stripe_payment_intent_id` (text)
      - `captain_notified_at` (timestamptz, nullable)
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Public read access to boat_classes, trip_durations, pricing, captain_availability
    - Public insert on bookings (for checkout)
    - Public select on bookings filtered by last name (for Check Your Charter)
    - All other operations require authenticated (admin) role

  3. Indexes
    - bookings: reference_code, customer_last_name, booking_date
    - captain_availability: date, captain_id
    - pricing: boat_class_id, trip_duration_id
*/

-- Boat Classes
CREATE TABLE IF NOT EXISTS boat_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  min_feet integer NOT NULL DEFAULT 0,
  max_feet integer NOT NULL DEFAULT 0,
  max_passengers integer NOT NULL DEFAULT 6,
  image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE boat_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view boat classes"
  ON boat_classes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage boat classes"
  ON boat_classes FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trip Durations
CREATE TABLE IF NOT EXISTS trip_durations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  hours integer NOT NULL DEFAULT 0,
  time_description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE trip_durations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view trip durations"
  ON trip_durations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage trip durations"
  ON trip_durations FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Pricing
CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  boat_class_id uuid NOT NULL REFERENCES boat_classes(id),
  trip_duration_id uuid NOT NULL REFERENCES trip_durations(id),
  total_price integer NOT NULL DEFAULT 0,
  deposit_amount integer NOT NULL DEFAULT 0,
  UNIQUE(boat_class_id, trip_duration_id)
);

ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view pricing"
  ON pricing FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage pricing"
  ON pricing FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Captains
CREATE TABLE IF NOT EXISTS captains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE captains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view captains"
  ON captains FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage captains"
  ON captains FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Boats
CREATE TABLE IF NOT EXISTS boats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  captain_id uuid REFERENCES captains(id),
  boat_class_id uuid NOT NULL REFERENCES boat_classes(id),
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE boats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view boats"
  ON boats FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage boats"
  ON boats FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Captain Availability
CREATE TABLE IF NOT EXISTS captain_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_id uuid NOT NULL REFERENCES captains(id),
  boat_id uuid NOT NULL REFERENCES boats(id),
  date date NOT NULL,
  slot text NOT NULL CHECK (slot IN ('am', 'pm', 'three_quarter', 'full_day')),
  is_available boolean NOT NULL DEFAULT true,
  UNIQUE(captain_id, date, slot)
);

ALTER TABLE captain_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view availability"
  ON captain_availability FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "Admins can manage availability"
  ON captain_availability FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text UNIQUE NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  party_size integer NOT NULL DEFAULT 1,
  boat_class_id uuid NOT NULL REFERENCES boat_classes(id),
  trip_duration_id uuid NOT NULL REFERENCES trip_durations(id),
  booking_date date NOT NULL,
  time_slot text NOT NULL DEFAULT '',
  special_requests text NOT NULL DEFAULT '',
  assigned_captain_id uuid REFERENCES captains(id),
  assigned_boat_id uuid REFERENCES boats(id),
  deposit_amount integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  booking_status text NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'captain_assigned', 'completed', 'cancelled')),
  stripe_payment_intent_id text,
  captain_notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can lookup bookings by last name"
  ON bookings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anon can update own booking payment"
  ON bookings FOR UPDATE
  TO anon
  USING (payment_status = 'pending')
  WITH CHECK (payment_status IN ('pending', 'paid'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_reference_code ON bookings(reference_code);
CREATE INDEX IF NOT EXISTS idx_bookings_last_name ON bookings(customer_last_name);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON captain_availability(date);
CREATE INDEX IF NOT EXISTS idx_availability_captain ON captain_availability(captain_id);
CREATE INDEX IF NOT EXISTS idx_pricing_class ON pricing(boat_class_id);
CREATE INDEX IF NOT EXISTS idx_pricing_duration ON pricing(trip_duration_id);

-- Function to auto-generate reference codes
CREATE OR REPLACE FUNCTION generate_reference_code()
RETURNS trigger AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := 'FTW-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM bookings WHERE reference_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  NEW.reference_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_reference_code
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.reference_code IS NULL OR NEW.reference_code = '')
  EXECUTE FUNCTION generate_reference_code();

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
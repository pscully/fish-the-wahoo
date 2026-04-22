export interface BoatClass {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  min_feet: number;
  max_feet: number;
  max_passengers: number;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface TripDuration {
  id: string;
  name: string;
  slug: string;
  hours: number;
  time_description: string;
  display_order: number;
}

export interface Pricing {
  id: string;
  boat_class_id: string;
  trip_duration_id: string;
  total_price: number;
  deposit_amount: number;
}

export interface PricingWithRelations extends Pricing {
  boat_classes: BoatClass;
  trip_durations: TripDuration;
}

export interface Captain {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  photo_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Boat {
  id: string;
  name: string;
  captain_id: string | null;
  boat_class_id: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface BoatWithRelations extends Boat {
  captains: Captain | null;
  boat_classes: BoatClass;
}

export interface CaptainAvailability {
  id: string;
  captain_id: string;
  boat_id: string;
  date: string;
  slot: 'am' | 'pm' | 'three_quarter' | 'full_day';
  is_available: boolean;
}

export interface Booking {
  id: string;
  reference_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  boat_class_id: string;
  trip_duration_id: string;
  booking_date: string;
  backup_date: string | null;
  backup_date_notes: string;
  time_slot: string;
  special_requests: string;
  assigned_captain_id: string | null;
  assigned_boat_id: string | null;
  deposit_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'captain_assigned' | 'completed' | 'cancelled';
  stripe_payment_intent_id: string | null;
  captain_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithRelations extends Booking {
  boat_classes: BoatClass;
  trip_durations: TripDuration;
  captains: Captain | null;
  boats: Boat | null;
}

export type BookingStep = 'class' | 'details' | 'info' | 'payment' | 'confirmation';

export interface BookingFormData {
  boatClassId: string;
  tripDurationId: string;
  bookingDate: Date | null;
  timeSlot: string;
  partySize: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

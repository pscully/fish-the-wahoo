import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@14.14.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Client-Info, Apikey',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return json({ error: 'Stripe is not configured.' }, 500);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseSecretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseSecretKey) return json({ error: 'Supabase env not set' }, 500);

  try {
    const body = await req.json();
    const {
      boatClassId,
      tripDurationId,
      bookingDate,
      backupDate,
      backupDateNotes,
      timeSlot,
      partySize,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = body;

    // --- Validation -------------------------------------------------------
    const errors: string[] = [];

    if (!boatClassId) errors.push('boatClassId required');
    if (!tripDurationId) errors.push('tripDurationId required');
    if (!bookingDate) errors.push('bookingDate required');
    if (!backupDate) errors.push('backupDate required');
    if (!firstName?.trim()) errors.push('firstName required');
    if (!lastName?.trim()) errors.push('lastName required');
    if (!email?.trim() || !EMAIL_RE.test(email)) errors.push('valid email required');

    const today = new Date().toISOString().slice(0, 10);
    if (bookingDate && bookingDate < today) errors.push('bookingDate must be in the future');
    if (backupDate && backupDate < today) errors.push('backupDate must be in the future');
    if (bookingDate && backupDate && bookingDate === backupDate) {
      errors.push('backupDate must differ from bookingDate');
    }

    const timeSlotNorm = timeSlot ?? '';
    if (timeSlotNorm && timeSlotNorm !== '06:00' && timeSlotNorm !== '12:00') {
      errors.push('timeSlot must be 06:00, 12:00, or empty');
    }

    const party = Number(partySize);
    if (!Number.isInteger(party) || party < 1 || party > 6) {
      errors.push('partySize must be 1-6');
    }

    if (errors.length) return json({ error: errors.join('; ') }, 400);

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // --- Resolve pricing (server-side, never trust client) ----------------
    const { data: pricing, error: pricingError } = await supabase
      .from('pricing')
      .select('total_price, deposit_amount')
      .eq('boat_class_id', boatClassId)
      .eq('trip_duration_id', tripDurationId)
      .maybeSingle();

    if (pricingError || !pricing) {
      return json({ error: 'Pricing not available for that boat class + duration.' }, 400);
    }

    const depositAmount = pricing.deposit_amount;
    if (!depositAmount || depositAmount < 50) {
      return json({ error: 'Deposit amount is invalid.' }, 500);
    }

    // --- Create Stripe PaymentIntent (NO auto-confirm) --------------------
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositAmount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Fish The Wahoo deposit — ${bookingDate}`,
      metadata: {
        customer_name: `${firstName} ${lastName}`,
        customer_email: email,
        booking_date: bookingDate,
        backup_date: backupDate ?? '',
        boat_class_id: boatClassId,
        trip_duration_id: tripDurationId,
      },
    });

    // --- Insert booking row (payment_status='pending') --------------------
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_first_name: firstName.trim(),
        customer_last_name: lastName.trim(),
        customer_email: email.trim(),
        customer_phone: (phone ?? '').trim(),
        party_size: party,
        boat_class_id: boatClassId,
        trip_duration_id: tripDurationId,
        booking_date: bookingDate,
        backup_date: backupDate ?? null,
        backup_date_notes: (backupDateNotes ?? '').trim(),
        time_slot: timeSlotNorm,
        special_requests: (specialRequests ?? '').trim(),
        deposit_amount: depositAmount,
        payment_status: 'pending',
        booking_status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select('id, reference_code')
      .single();

    if (bookingError || !booking) {
      // Best-effort: cancel the payment intent since we failed to persist.
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id);
      } catch {
        /* ignore */
      }
      return json({ error: 'Failed to create booking. Please try again.' }, 500);
    }

    return json({
      clientSecret: paymentIntent.client_secret,
      referenceCode: booking.reference_code,
      depositAmount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return json({ error: message }, 500);
  }
});

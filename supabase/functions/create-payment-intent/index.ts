import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.14.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({
          error: "Stripe is not configured. Please contact support.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      boatClassId,
      tripDurationId,
      bookingDate,
      partySize,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = body;

    if (!boatClassId || !tripDurationId || !bookingDate || !firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required booking fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: pricing, error: pricingError } = await supabase
      .from("pricing")
      .select("*")
      .eq("boat_class_id", boatClassId)
      .eq("trip_duration_id", tripDurationId)
      .maybeSingle();

    if (pricingError || !pricing) {
      return new Response(
        JSON.stringify({ error: "Could not find pricing for selected options." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const depositAmount = pricing.deposit_amount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositAmount,
      currency: "usd",
      metadata: {
        boat_class_id: boatClassId,
        trip_duration_id: tripDurationId,
        booking_date: bookingDate,
        customer_name: `${firstName} ${lastName}`,
        customer_email: email,
      },
      receipt_email: email,
    });

    await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: "pm_card_visa",
      return_url: `${req.headers.get("origin") || "https://fishthewahoo.com"}/check`,
    });

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_email: email,
        customer_phone: phone || "",
        party_size: partySize || 2,
        boat_class_id: boatClassId,
        trip_duration_id: tripDurationId,
        booking_date: bookingDate,
        special_requests: specialRequests || "",
        deposit_amount: depositAmount,
        payment_status: "paid",
        booking_status: "confirmed",
        stripe_payment_intent_id: paymentIntent.id,
        reference_code: "",
      })
      .select("reference_code")
      .single();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: "Booking created but failed to save. Please contact support." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceCode: booking.reference_code,
        depositAmount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

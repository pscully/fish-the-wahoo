import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { bookingId } = await req.json();

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: "Missing bookingId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, boat_classes(*), trip_durations(*), captains(*), boats(*)")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!booking.assigned_captain_id || !booking.captains) {
      return new Response(
        JSON.stringify({ error: "No captain assigned to this booking" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const captain = booking.captains;
    const boatClass = booking.boat_classes;
    const tripDuration = booking.trip_durations;
    const boat = booking.boats;

    const emailBody = `
Captain ${captain.name},

You have a new charter booking assignment from Fish The Wahoo:

BOOKING DETAILS:
- Reference: ${booking.reference_code}
- Date: ${booking.booking_date}
- Duration: ${tripDuration?.name} (${tripDuration?.time_description})
- Vessel Class: ${boatClass?.name}
${boat ? `- Boat: ${boat.name}` : ""}
- Party Size: ${booking.party_size} guest(s)

CUSTOMER:
- Name: ${booking.customer_first_name} ${booking.customer_last_name}
- Phone: ${booking.customer_phone}
- Email: ${booking.customer_email}
${booking.special_requests ? `- Special Requests: ${booking.special_requests}` : ""}

PAYMENT NOTE:
The customer has paid a booking deposit to Fish The Wahoo. Please collect the remaining charter balance directly from the customer on the day of the trip.

Thank you,
Fish The Wahoo Team
(843) 568-3222
    `.trim();

    console.log("Captain notification email content:", emailBody);
    console.log("Would send to:", captain.email);

    await supabase
      .from("bookings")
      .update({ captain_notified_at: new Date().toISOString() })
      .eq("id", bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification prepared for Captain ${captain.name}`,
        captainEmail: captain.email,
        emailBody,
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

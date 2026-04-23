import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendMail } from '../_shared/postmark.ts';
import { captainAssignmentEmail, type BookingContext } from '../_shared/email-templates.ts';

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseSecretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseSecretKey) return json({ error: 'Supabase env not set' }, 500);

  try {
    const { bookingId } = await req.json();
    if (!bookingId) return json({ error: 'Missing bookingId' }, 400);

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(
        '*, boat_classes(name), trip_durations(name), captains(name, email), boats(name)',
      )
      .eq('id', bookingId)
      .single();

    if (error || !booking) return json({ error: 'Booking not found' }, 404);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b = booking as any;
    if (!b.assigned_captain_id || !b.captains?.email) {
      return json({ error: 'No captain assigned or captain has no email' }, 400);
    }

    const ctx: BookingContext = {
      referenceCode: b.reference_code,
      firstName: b.customer_first_name,
      lastName: b.customer_last_name,
      email: b.customer_email,
      phone: b.customer_phone,
      partySize: b.party_size,
      className: b.boat_classes?.name ?? '',
      durationName: b.trip_durations?.name ?? '',
      bookingDate: b.booking_date,
      backupDate: b.backup_date,
      backupDateNotes: b.backup_date_notes ?? '',
      timeSlot: b.time_slot ?? '',
      specialRequests: b.special_requests ?? '',
      depositAmountCents: b.deposit_amount,
    };

    const email = captainAssignmentEmail(ctx, {
      captainName: b.captains.name,
      boatName: b.boats?.name,
    });

    await sendMail({
      to: b.captains.email,
      subject: email.subject,
      htmlBody: email.html,
      textBody: email.text,
      replyTo: b.customer_email,
      tag: 'captain-assignment',
    });

    await supabase
      .from('bookings')
      .update({ captain_notified_at: new Date().toISOString() })
      .eq('id', bookingId);

    return json({ success: true, captainEmail: b.captains.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return json({ error: message }, 500);
  }
});

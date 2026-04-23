import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@14.14.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendMail } from '../_shared/postmark.ts';
import {
  customerBookingThanks,
  adminBookingNotice,
  type BookingContext,
} from '../_shared/email-templates.ts';

/**
 * Stripe webhook handler. Finalizes bookings after payment and fires emails.
 *
 * Deployed endpoint:
 *   https://cidzchicqmcdpymgxhbm.supabase.co/functions/v1/stripe-webhook
 *
 * Configure the webhook in Stripe dashboard → Developers → Webhooks.
 * Listen for: payment_intent.succeeded, payment_intent.payment_failed.
 *
 * Env required:
 *   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL,
 *   SUPABASE_SERVICE_ROLE_KEY (auto-injected by Supabase; holds the
 *   active sb_secret_... value after key rotation),
 *   POSTMARK_SERVER_TOKEN, POSTMARK_FROM_EMAIL,
 *   ADMIN_EMAILS (comma-separated), GBP_REVIEW_URL, PUBLIC_SITE_URL.
 */

function must(key: string): string {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`${key} not set`);
  return v;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let stripeKey: string;
  let webhookSecret: string;
  try {
    stripeKey = must('STRIPE_SECRET_KEY');
    webhookSecret = must('STRIPE_WEBHOOK_SECRET');
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing stripe-signature header', { status: 400 });

  const rawBody = await req.text();
  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (err) {
    return new Response(
      `Webhook signature verification failed: ${(err as Error).message}`,
      { status: 400 },
    );
  }

  const supabase = createClient(must('SUPABASE_URL'), must('SUPABASE_SERVICE_ROLE_KEY'));

  try {
    if (event.type === 'payment_intent.succeeded') {
      await onPaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase);
    } else if (event.type === 'payment_intent.payment_failed') {
      await onPaymentFailed(event.data.object as Stripe.PaymentIntent, supabase);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[stripe-webhook] handler error', err);
    // Return 500 so Stripe retries. Logs will surface the reason.
    return new Response(`Handler error: ${(err as Error).message}`, { status: 500 });
  }
});

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

type SupabaseClient = ReturnType<typeof createClient>;

async function onPaymentSucceeded(pi: Stripe.PaymentIntent, supabase: SupabaseClient) {
  // 1) Flip booking status to paid/confirmed.
  const { data: updated, error: updateErr } = await supabase
    .from('bookings')
    .update({ payment_status: 'paid', booking_status: 'confirmed' })
    .eq('stripe_payment_intent_id', pi.id)
    .select(
      'id, reference_code, customer_first_name, customer_last_name, customer_email, customer_phone, party_size, booking_date, backup_date, backup_date_notes, time_slot, special_requests, deposit_amount, boat_classes(name), trip_durations(name)',
    )
    .maybeSingle();

  if (updateErr) throw updateErr;
  if (!updated) {
    console.warn(`[stripe-webhook] no booking matched payment intent ${pi.id}`);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = updated as any;
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

  const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://fishthewahoo.com';
  const gbpReviewUrl = Deno.env.get('GBP_REVIEW_URL') ?? '';
  const adminEmails = (Deno.env.get('ADMIN_EMAILS') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // 2) Send customer thank-you.
  try {
    const customer = customerBookingThanks(ctx, { gbpReviewUrl, siteUrl });
    await sendMail({
      to: ctx.email,
      subject: customer.subject,
      htmlBody: customer.html,
      textBody: customer.text,
      tag: 'customer-booking-confirmation',
    });
  } catch (err) {
    console.error('[stripe-webhook] customer email failed', err);
  }

  // 3) Send admin notice (combined booking + deposit paid).
  if (adminEmails.length) {
    try {
      const admin = adminBookingNotice(ctx, { siteUrl });
      await sendMail({
        to: adminEmails,
        subject: admin.subject,
        htmlBody: admin.html,
        textBody: admin.text,
        replyTo: ctx.email,
        tag: 'admin-new-booking',
      });
    } catch (err) {
      console.error('[stripe-webhook] admin email failed', err);
    }
  }
}

async function onPaymentFailed(pi: Stripe.PaymentIntent, supabase: SupabaseClient) {
  // Leave booking at payment_status='pending'. Admin can clean up stale rows.
  await supabase
    .from('bookings')
    .update({ payment_status: 'pending' })
    .eq('stripe_payment_intent_id', pi.id);
  console.log(`[stripe-webhook] payment_intent.payment_failed for ${pi.id}`);
}

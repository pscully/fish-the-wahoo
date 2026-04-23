import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendMail } from '../_shared/postmark.ts';
import { contactSubmissionNotice } from '../_shared/email-templates.ts';

/**
 * Contact form submission handler. Inserts a row into contact_submissions
 * and emails ADMIN_EMAILS via Postmark. Called by /contact via
 * supabase.functions.invoke('contact-submit'). Deployed with verify_jwt=false
 * because the sb_publishable_ key isn't a JWT; this function does its own
 * input validation + honeypot + rate limit.
 */

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

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseSecretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseSecretKey) return json({ error: 'Supabase env not set' }, 500);

  try {
    const body = await req.json();
    const { name, email, phone, message, honeypot } = body;

    // --- Honeypot: silently accept bot submissions without persisting ---
    if (honeypot && String(honeypot).trim().length > 0) {
      return json({ success: true });
    }

    // --- Validation ---
    const errors: string[] = [];
    const nameTrim = String(name ?? '').trim();
    const emailTrim = String(email ?? '').trim();
    const phoneTrim = String(phone ?? '').trim();
    const messageTrim = String(message ?? '').trim();

    if (nameTrim.length < 2) errors.push('name required');
    if (!EMAIL_RE.test(emailTrim)) errors.push('valid email required');
    if (messageTrim.length < 10) errors.push('message must be at least 10 characters');
    if (messageTrim.length > 5000) errors.push('message too long');

    if (errors.length) return json({ error: errors.join('; ') }, 400);

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // --- Rate limit: reject if 3+ from same email in the last 60 seconds ---
    const { count: recentCount } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('email', emailTrim)
      .gte('created_at', new Date(Date.now() - 60_000).toISOString());
    if ((recentCount ?? 0) >= 3) {
      return json({ error: 'Too many submissions. Please try again in a minute.' }, 429);
    }

    // --- Insert ---
    const { data: row, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: nameTrim,
        email: emailTrim,
        phone: phoneTrim,
        message: messageTrim,
      })
      .select('id')
      .single();

    if (insertError || !row) {
      return json({ error: 'Could not save your message. Please try again.' }, 500);
    }

    // --- Fire admin email (best-effort; row is already persisted) ---
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://fishthewahoo.com';
    const adminEmails = (Deno.env.get('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (adminEmails.length) {
      try {
        const tmpl = contactSubmissionNotice(
          { name: nameTrim, email: emailTrim, phone: phoneTrim, message: messageTrim },
          { siteUrl },
        );
        await sendMail({
          to: adminEmails,
          subject: tmpl.subject,
          htmlBody: tmpl.html,
          textBody: tmpl.text,
          replyTo: emailTrim,
          tag: 'contact-submission',
        });
      } catch (err) {
        console.error('[contact-submit] admin email failed', err);
      }
    }

    return json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error';
    return json({ error: msg }, 500);
  }
});

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
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

type Action = 'list' | 'invite' | 'delete';

interface RequestBody {
  action: Action;
  email?: string;
  id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseSecretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseSecretKey) return json({ error: 'Supabase env not set' }, 500);

  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const {
    data: { user: callerUser },
    error: callerError,
  } = await supabaseAdmin.auth.getUser(token);
  if (callerError || !callerUser) return json({ error: 'Unauthorized' }, 401);

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    if (body.action === 'list') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
      if (error) return json({ error: error.message }, 500);
      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        invited_at: u.invited_at,
        email_confirmed_at: u.email_confirmed_at,
      }));
      return json({ users });
    }

    if (body.action === 'invite') {
      if (!body.email) return json({ error: 'Missing email' }, 400);
      const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://fishthewahoo.com';
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(body.email, {
        redirectTo: `${siteUrl}/admin/auth/callback?type=invite`,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ user: { id: data.user?.id, email: data.user?.email } });
    }

    if (body.action === 'delete') {
      if (!body.id) return json({ error: 'Missing id' }, 400);
      if (body.id === callerUser.id) return json({ error: 'You cannot delete yourself.' }, 400);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return json({ error: message }, 500);
  }
});

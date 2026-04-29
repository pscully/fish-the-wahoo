# Supabase auth email templates

Branded HTML for the auth emails Supabase sends from the project. These files are the source of truth — paste their contents into the Supabase dashboard whenever they change.

## One-time dashboard setup

1. **URL Configuration** (`Authentication → URL Configuration`)
   - **Site URL**: `https://fishthewahoo.com`
   - **Redirect URLs** (add both):
     - `https://fishthewahoo.com/admin/auth/callback`
     - `http://localhost:5173/admin/auth/callback`

2. **Email Templates** (`Authentication → Email Templates`)
   - **Invite user**: paste the contents of [`invite.html`](./invite.html). Subject: `You've been invited to Fish The Wahoo Admin`.
   - **Reset Password**: paste the contents of [`recovery.html`](./recovery.html). Subject: `Reset your Fish The Wahoo Admin password`.

3. **Deploy the user-management edge function**

   ```bash
   supabase functions deploy admin-users
   ```

## How the link works

Both templates use `{{ .ConfirmationURL }}`, which Supabase builds from the `redirectTo` parameter passed at send time. Two callers set that:

- `supabase/functions/admin-users/index.ts` — invite flow, redirects to `${PUBLIC_SITE_URL}/admin/auth/callback?type=invite`. Set `PUBLIC_SITE_URL` in the function's secrets if you want to override the `https://fishthewahoo.com` default.
- `src/pages/admin/AdminForgotPassword.tsx` — recovery flow, redirects to `${window.location.origin}/admin/auth/callback?type=recovery`.

The callback page (`src/pages/admin/AdminAuthCallback.tsx`) handles the session exchange and password set for both flows.

## Editing

Test changes by sending yourself an invite or password reset, then preview in Gmail / Apple Mail. Email clients strip a lot — keep table-based layout, inline styles, and avoid CSS classes.

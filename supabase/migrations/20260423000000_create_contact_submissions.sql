-- Contact form submissions from /contact. Created by the contact-submit
-- edge function when a visitor sends a message; reviewed in /admin/contacts.

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'spam')),
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_status on contact_submissions(status);
create index if not exists idx_contact_submissions_created on contact_submissions(created_at desc);

create trigger trg_contact_submissions_updated_at
  before update on contact_submissions
  for each row execute function update_updated_at();

alter table contact_submissions enable row level security;

-- Anon submits the form
create policy "Public can submit contact form"
  on contact_submissions for insert
  to anon
  with check (true);

-- Authenticated admin reads + updates (same pattern as bookings)
create policy "Admins can read contacts"
  on contact_submissions for select
  to authenticated
  using (true);

create policy "Admins can update contacts"
  on contact_submissions for update
  to authenticated
  using (true);

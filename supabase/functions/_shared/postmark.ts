/**
 * Thin Postmark client for Supabase edge functions. No SDK — just fetch.
 *
 * Reads POSTMARK_SERVER_TOKEN and POSTMARK_FROM_EMAIL from env. Throws if
 * either is missing so the caller can decide how loud to be about it.
 */

export interface PostmarkMessage {
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody: string;
  replyTo?: string;
  tag?: string;
}

export async function sendMail(msg: PostmarkMessage): Promise<void> {
  const token = Deno.env.get('POSTMARK_SERVER_TOKEN');
  const from = Deno.env.get('POSTMARK_FROM_EMAIL');

  if (!token) throw new Error('POSTMARK_SERVER_TOKEN is not set');
  if (!from) throw new Error('POSTMARK_FROM_EMAIL is not set');

  const to = Array.isArray(msg.to) ? msg.to.join(',') : msg.to;

  const res = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: msg.subject,
      HtmlBody: msg.htmlBody,
      TextBody: msg.textBody,
      MessageStream: 'outbound',
      ...(msg.replyTo ? { ReplyTo: msg.replyTo } : {}),
      ...(msg.tag ? { Tag: msg.tag } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Postmark send failed (${res.status}): ${body}`);
  }
}

/**
 * Transactional email templates for Fish The Wahoo bookings.
 * Each template returns { subject, html, text } — callers feed that into
 * the Postmark sendMail helper.
 */

export interface BookingContext {
  referenceCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partySize: number;
  className: string;
  durationName: string;
  bookingDate: string;
  backupDate: string | null;
  backupDateNotes: string;
  timeSlot: string;
  specialRequests: string;
  depositAmountCents: number;
}

function formatMoneyCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  // iso is 'YYYY-MM-DD'. Render as e.g. "Tuesday, April 29, 2026".
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatTimeSlot(slot: string): string {
  if (slot === '06:00') return '6:00 AM departure';
  if (slot === '12:00') return '12:00 PM departure';
  return '';
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Customer thank-you email
// ---------------------------------------------------------------------------

export function customerBookingThanks(
  booking: BookingContext,
  opts: { gbpReviewUrl: string; siteUrl: string },
) {
  const timeSlotLine = formatTimeSlot(booking.timeSlot);
  const subject = `Your Fish The Wahoo booking is confirmed (${booking.referenceCode})`;

  const text = `
Hi ${booking.firstName},

Your deposit is paid and your booking is confirmed.

Reference code: ${booking.referenceCode}

TRIP DETAILS
- Vessel class: ${booking.className}
- Duration: ${booking.durationName}${timeSlotLine ? `\n- Departure: ${timeSlotLine}` : ''}
- Preferred date: ${formatDate(booking.bookingDate)}${booking.backupDate ? `\n- Backup date: ${formatDate(booking.backupDate)}` : ''}${booking.backupDateNotes ? `\n- Flexibility notes: ${booking.backupDateNotes}` : ''}
- Party size: ${booking.partySize}
- Deposit paid: ${formatMoneyCents(booking.depositAmountCents)}

Your captain will reach out shortly to confirm your dates and provide next steps and trip preparation details.

Enjoyed the booking process? We'd love a review on Google:
${opts.gbpReviewUrl}

View your booking anytime:
${opts.siteUrl}/check?ref=${booking.referenceCode}

Tight lines,
Fish The Wahoo
(843) 568-3222
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f8; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background: #0a192f; color: #ffffff; padding: 24px 32px;">
      <h1 style="margin: 0; font-size: 22px;">Your booking is confirmed</h1>
      <p style="margin: 8px 0 0 0; color: #fbbf24; font-size: 13px; letter-spacing: 0.1em;">${esc(booking.referenceCode)}</p>
    </div>
    <div style="padding: 28px 32px; color: #1a2330; line-height: 1.55;">
      <p>Hi ${esc(booking.firstName)},</p>
      <p>Your deposit is paid and your booking is confirmed. Here's what's on the schedule:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b; width: 40%;">Vessel class</td><td style="padding: 6px 0;">${esc(booking.className)}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Duration</td><td style="padding: 6px 0;">${esc(booking.durationName)}</td></tr>
        ${timeSlotLine ? `<tr><td style="padding: 6px 0; color: #64748b;">Departure</td><td style="padding: 6px 0;">${esc(timeSlotLine)}</td></tr>` : ''}
        <tr><td style="padding: 6px 0; color: #64748b;">Preferred date</td><td style="padding: 6px 0;">${esc(formatDate(booking.bookingDate))}</td></tr>
        ${booking.backupDate ? `<tr><td style="padding: 6px 0; color: #64748b;">Backup date</td><td style="padding: 6px 0;">${esc(formatDate(booking.backupDate))}</td></tr>` : ''}
        ${booking.backupDateNotes ? `<tr><td style="padding: 6px 0; color: #64748b;">Flex notes</td><td style="padding: 6px 0;">${esc(booking.backupDateNotes)}</td></tr>` : ''}
        <tr><td style="padding: 6px 0; color: #64748b;">Party size</td><td style="padding: 6px 0;">${booking.partySize}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Deposit paid</td><td style="padding: 6px 0; font-weight: bold;">${formatMoneyCents(booking.depositAmountCents)}</td></tr>
      </table>
      <p style="background: #fff7ed; border-left: 3px solid #f97316; padding: 12px 16px; margin: 18px 0; font-size: 14px;">
        Your captain will reach out shortly to confirm your dates and provide next steps and trip preparation details.
      </p>
      <p style="margin: 24px 0 8px 0;">
        <a href="${esc(opts.gbpReviewUrl)}" style="display: inline-block; background: #f97316; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Leave a Google review</a>
      </p>
      <p style="font-size: 13px; color: #64748b;">
        <a href="${esc(opts.siteUrl)}/check?ref=${esc(booking.referenceCode)}" style="color: #0a192f;">View your booking anytime →</a>
      </p>
    </div>
    <div style="padding: 16px 32px; background: #f4f6f8; color: #64748b; font-size: 12px; text-align: center;">
      Fish The Wahoo · Charleston, SC · (843) 568-3222
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Admin booking + deposit-paid notice
// ---------------------------------------------------------------------------

export function adminBookingNotice(
  booking: BookingContext,
  opts: { siteUrl: string },
) {
  const timeSlotLine = formatTimeSlot(booking.timeSlot);
  const subject = `New booking ${booking.referenceCode} — ${formatMoneyCents(booking.depositAmountCents)} deposit paid`;

  const text = `
NEW BOOKING — deposit paid
==========================

Reference: ${booking.referenceCode}
Deposit:   ${formatMoneyCents(booking.depositAmountCents)} (paid via Stripe)

CUSTOMER
- Name: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Phone: ${booking.phone || '(not provided)'}
- Party size: ${booking.partySize}

TRIP
- Vessel class: ${booking.className}
- Duration: ${booking.durationName}${timeSlotLine ? `\n- Departure: ${timeSlotLine}` : ''}
- Preferred date: ${formatDate(booking.bookingDate)}${booking.backupDate ? `\n- Backup date: ${formatDate(booking.backupDate)}` : ''}${booking.backupDateNotes ? `\n- Flex notes: ${booking.backupDateNotes}` : ''}

${booking.specialRequests ? `SPECIAL REQUESTS\n${booking.specialRequests}\n\n` : ''}ADMIN PANEL
${opts.siteUrl}/admin/bookings
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f8; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background: #0a192f; color: #ffffff; padding: 20px 28px;">
      <div style="color: #fbbf24; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">New Booking</div>
      <h1 style="margin: 6px 0 0 0; font-size: 20px;">${esc(booking.referenceCode)} · ${formatMoneyCents(booking.depositAmountCents)} paid</h1>
    </div>
    <div style="padding: 24px 28px; color: #1a2330; line-height: 1.5;">
      <h2 style="font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Customer</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 14px;">
        <tr><td style="padding: 4px 0; color: #64748b; width: 36%;">Name</td><td style="padding: 4px 0;">${esc(booking.firstName)} ${esc(booking.lastName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Email</td><td style="padding: 4px 0;"><a href="mailto:${esc(booking.email)}" style="color: #0a192f;">${esc(booking.email)}</a></td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Phone</td><td style="padding: 4px 0;">${esc(booking.phone || '(not provided)')}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Party size</td><td style="padding: 4px 0;">${booking.partySize}</td></tr>
      </table>
      <h2 style="font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Trip</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 14px;">
        <tr><td style="padding: 4px 0; color: #64748b; width: 36%;">Vessel class</td><td style="padding: 4px 0;">${esc(booking.className)}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Duration</td><td style="padding: 4px 0;">${esc(booking.durationName)}</td></tr>
        ${timeSlotLine ? `<tr><td style="padding: 4px 0; color: #64748b;">Departure</td><td style="padding: 4px 0;">${esc(timeSlotLine)}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; color: #64748b;">Preferred date</td><td style="padding: 4px 0; font-weight: bold;">${esc(formatDate(booking.bookingDate))}</td></tr>
        ${booking.backupDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Backup date</td><td style="padding: 4px 0;">${esc(formatDate(booking.backupDate))}</td></tr>` : ''}
        ${booking.backupDateNotes ? `<tr><td style="padding: 4px 0; color: #64748b;">Flex notes</td><td style="padding: 4px 0;">${esc(booking.backupDateNotes)}</td></tr>` : ''}
      </table>
      ${
        booking.specialRequests
          ? `<h2 style="font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Special requests</h2>
             <p style="background: #fff7ed; border-left: 3px solid #f97316; padding: 10px 14px; margin: 0 0 18px 0; font-size: 14px;">${esc(booking.specialRequests)}</p>`
          : ''
      }
      <p style="margin: 20px 0 0 0;">
        <a href="${esc(opts.siteUrl)}/admin/bookings" style="display: inline-block; background: #f97316; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 14px;">Open admin panel</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Captain assignment email (triggered manually from admin panel)
// ---------------------------------------------------------------------------

export function captainAssignmentEmail(
  booking: BookingContext,
  opts: { captainName: string; boatName?: string },
) {
  const timeSlotLine = formatTimeSlot(booking.timeSlot);
  const subject = `Charter assignment — ${booking.referenceCode} on ${formatDate(booking.bookingDate)}`;

  const text = `
Captain ${opts.captainName},

You have a new charter booking assignment from Fish The Wahoo.

BOOKING
- Reference: ${booking.referenceCode}
- Preferred date: ${formatDate(booking.bookingDate)}${booking.backupDate ? `\n- Backup date: ${formatDate(booking.backupDate)}` : ''}${booking.backupDateNotes ? `\n- Flex notes: ${booking.backupDateNotes}` : ''}
- Duration: ${booking.durationName}${timeSlotLine ? `\n- Departure: ${timeSlotLine}` : ''}
- Vessel class: ${booking.className}${opts.boatName ? `\n- Boat: ${opts.boatName}` : ''}
- Party size: ${booking.partySize}

CUSTOMER
- Name: ${booking.firstName} ${booking.lastName}
- Email: ${booking.email}
- Phone: ${booking.phone || '(not provided)'}${booking.specialRequests ? `\n\nSPECIAL REQUESTS\n${booking.specialRequests}` : ''}

The customer has paid their deposit to Fish The Wahoo. Collect the remaining charter balance directly from the customer on the day of the trip.

Thank you,
Fish The Wahoo
(843) 568-3222
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f8; margin: 0; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background: #0a192f; color: #ffffff; padding: 20px 28px;">
      <div style="color: #fbbf24; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Charter Assignment</div>
      <h1 style="margin: 6px 0 0 0; font-size: 20px;">${esc(booking.referenceCode)}</h1>
    </div>
    <div style="padding: 24px 28px; color: #1a2330; line-height: 1.55;">
      <p>Captain ${esc(opts.captainName)},</p>
      <p>You have a new charter booking assignment from Fish The Wahoo.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 14px;">
        <tr><td style="padding: 4px 0; color: #64748b; width: 40%;">Preferred date</td><td style="padding: 4px 0; font-weight: bold;">${esc(formatDate(booking.bookingDate))}</td></tr>
        ${booking.backupDate ? `<tr><td style="padding: 4px 0; color: #64748b;">Backup date</td><td style="padding: 4px 0;">${esc(formatDate(booking.backupDate))}</td></tr>` : ''}
        ${booking.backupDateNotes ? `<tr><td style="padding: 4px 0; color: #64748b;">Flex notes</td><td style="padding: 4px 0;">${esc(booking.backupDateNotes)}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; color: #64748b;">Duration</td><td style="padding: 4px 0;">${esc(booking.durationName)}</td></tr>
        ${timeSlotLine ? `<tr><td style="padding: 4px 0; color: #64748b;">Departure</td><td style="padding: 4px 0;">${esc(timeSlotLine)}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; color: #64748b;">Vessel class</td><td style="padding: 4px 0;">${esc(booking.className)}</td></tr>
        ${opts.boatName ? `<tr><td style="padding: 4px 0; color: #64748b;">Boat</td><td style="padding: 4px 0;">${esc(opts.boatName)}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; color: #64748b;">Party size</td><td style="padding: 4px 0;">${booking.partySize}</td></tr>
      </table>
      <h2 style="font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 18px 0 8px 0;">Customer</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 14px;">
        <tr><td style="padding: 4px 0; color: #64748b; width: 40%;">Name</td><td style="padding: 4px 0;">${esc(booking.firstName)} ${esc(booking.lastName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Email</td><td style="padding: 4px 0;"><a href="mailto:${esc(booking.email)}" style="color: #0a192f;">${esc(booking.email)}</a></td></tr>
        <tr><td style="padding: 4px 0; color: #64748b;">Phone</td><td style="padding: 4px 0;">${esc(booking.phone || '(not provided)')}</td></tr>
      </table>
      ${
        booking.specialRequests
          ? `<p style="background: #fff7ed; border-left: 3px solid #f97316; padding: 10px 14px; margin: 0 0 14px 0; font-size: 14px;">
               <strong>Special requests:</strong> ${esc(booking.specialRequests)}
             </p>`
          : ''
      }
      <p style="background: #f4f6f8; padding: 12px 16px; margin: 18px 0 0 0; font-size: 13px; color: #475569;">
        The customer has paid their deposit to Fish The Wahoo. Collect the remaining charter balance directly from the customer on the day of the trip.
      </p>
    </div>
    <div style="padding: 14px 28px; background: #f4f6f8; color: #64748b; font-size: 12px; text-align: center;">
      Fish The Wahoo · (843) 568-3222
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

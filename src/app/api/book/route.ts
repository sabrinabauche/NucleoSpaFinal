import { google } from 'googleapis';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const TIMEZONE = 'America/Mexico_City';
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function buildDateTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function formatDateEs(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} de ${MONTHS_ES[parseInt(m) - 1]} de ${y}`;
}

function getCalendarAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
}

export async function POST(req: NextRequest) {
  const {
    treatments,
    date,
    startTime,
    endTime,
    durationMinutes,
    name,
    email,
    phone,
  } = await req.json();

  if (!date || !startTime || !endTime || !name || !email) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const treatmentList: string = Array.isArray(treatments) ? treatments.join(', ') : treatments;
  const dateFormatted = formatDateEs(date);
  let calendarError = '';

  // ── 1. Google Calendar ───────────────────────────────────
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Faltan credenciales de Google');
    }

    const auth     = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    console.log('[/api/book] Creando evento en calendario:', calendarId);

    const event = {
      summary:     `Núcleo Clinique · ${name}`,
      description: [
        `Tratamiento(s): ${treatmentList}`,
        `Duración: ${durationMinutes} min`,
        `Cliente: ${name}`,
        `Correo: ${email}`,
        `Teléfono: ${phone || 'No proporcionado'}`,
      ].join('\n'),
      start: { dateTime: buildDateTime(date, startTime), timeZone: TIMEZONE },
      end:   { dateTime: buildDateTime(date, endTime),   timeZone: TIMEZONE },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email' as const, minutes: 24 * 60 },
          { method: 'popup' as const, minutes: 60 },
        ],
      },
    };

    const created = await calendar.events.insert({ calendarId, requestBody: event, sendUpdates: 'none' });
    console.log('[/api/book] Evento creado:', created.data.id, created.data.htmlLink);

  } catch (err) {
    calendarError = err instanceof Error ? err.message : String(err);
    console.error('[/api/book] Google Calendar error:', calendarError);
  }

  if (calendarError) {
    return NextResponse.json({ error: calendarError }, { status: 500 });
  }

  // ── 2. Resend — email al cliente ─────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'Núcleo Clinique <onboarding@resend.dev>',
        to:      email,
        subject: `Tu cita en Núcleo Clinique – ${dateFormatted}`,
        html:    buildClientEmail({ name, treatmentList, dateFormatted, startTime, endTime }),
      });

      if (process.env.RESEND_NOTIFY_EMAIL) {
        await resend.emails.send({
          from:    process.env.RESEND_FROM_EMAIL ?? 'Núcleo Clinique <no-reply@nucleoclinique.com>',
          to:      process.env.RESEND_NOTIFY_EMAIL,
          subject: `Nueva cita: ${name} – ${dateFormatted} ${startTime}`,
          html:    buildSpaEmail({ name, email, phone, treatmentList, dateFormatted, startTime, endTime }),
        });
      }

      // Invitación .ics a Roberta (compatible con Zoho Mail Calendar)
      const icsContent = buildICS({ name, treatmentList, date, startTime, endTime, durationMinutes });
      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'Núcleo Clinique <no-reply@nucleoclinique.com>',
        to:      'roberta@nucleoclinique.com',
        subject: `Nueva cita: ${name} – ${dateFormatted} ${startTime}`,
        html:    buildSpaEmail({ name, email, phone, treatmentList, dateFormatted, startTime, endTime }),
        attachments: [
          {
            filename: 'cita.ics',
            content:  Buffer.from(icsContent).toString('base64'),
          },
        ],
      });

    } catch (err) {
      console.error('[/api/book] Resend error:', err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ ok: true });
}

function buildClientEmail({ name, treatmentList, dateFormatted, startTime, endTime }: {
  name: string; treatmentList: string; dateFormatted: string; startTime: string; endTime: string;
}) {
  const firstName = name.split(' ')[0];
  const waText = encodeURIComponent(
    `Hola, soy ${name}. Quiero confirmar mi cita de ${treatmentList} el ${dateFormatted} a las ${startTime} hrs.`
  );
  const waUrl = `https://wa.me/525528425370?text=${waText}`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="es">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
    <style>@media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}</style>
  </head>
  <body dir="ltr" lang="es" style="background-color:#f7f5f3;margin:0;padding:0">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody><tr><td dir="ltr" lang="es" style="background-color:#f7f5f3;margin:0;padding:0">
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:580px;width:100%;background-color:#ffffff;border-radius:0;margin:0 auto">
          <tbody><tr style="width:100%"><td style="padding:0">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;padding:0">
              <tbody><tr style="margin:0;padding:0">
                <td align="center" style="margin:0;padding:40px 16px 48px;background-color:#f7f5f3">
                  <table width="580" border="0" cellpadding="0" cellspacing="0" role="presentation"
                         style="max-width:580px;width:100%;background:#ffffff;margin:0;padding:0">
                    <tbody>

                      <!-- Header imagen -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:0;font-size:0;line-height:0">
                          <img alt="NÚCLEO"
                               src="https://resend-attachments.s3.amazonaws.com/9ed2b9dc-bcad-4dab-aeeb-8edcaaac9d91"
                               style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;height:auto"
                               width="100%" />
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:0 52px">
                          <div style="margin:0;padding:0;height:1px;background:#ece8e3"></div>
                        </td>
                      </tr>

                      <!-- Saludo -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:36px 52px 28px">
                          <p style="margin:0 0 6px;padding:0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c4a87a;line-height:1">
                            Confirmación de cita
                          </p>
                          <p style="margin:0;padding:0;font-family:'Georgia','Times New Roman',serif;font-size:24px;color:#1a1008;line-height:1.3;font-weight:400">
                            Hola, ${firstName}.
                          </p>
                        </td>
                      </tr>

                      <!-- Detalle -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:0 52px 36px">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;padding:0">
                            <tbody>
                              <tr style="margin:0;padding:0">
                                <td style="margin:0;padding:0 0 20px;border-bottom:1px solid #ece8e3">
                                  <p style="margin:0 0 6px;padding:0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#b0a090;line-height:1">Tratamiento</p>
                                  <p style="margin:0;padding:0;font-family:'Georgia','Times New Roman',serif;font-size:16px;color:#1a1008;line-height:1.5">${treatmentList}</p>
                                </td>
                              </tr>
                              <tr style="margin:0;padding:0">
                                <td style="margin:0;padding:20px 0 0">
                                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;padding:0">
                                    <tbody><tr style="margin:0;padding:0">
                                      <td style="margin:0;padding:0">
                                        <p style="margin:0 0 6px;padding:0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#b0a090;line-height:1">Fecha</p>
                                        <p style="margin:0;padding:0;font-size:14px;color:#1a1008;line-height:1.5">${dateFormatted}</p>
                                      </td>
                                      <td style="margin:0;padding:0">
                                        <p style="margin:0 0 6px;padding:0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#b0a090;line-height:1">Horario</p>
                                        <p style="margin:0;padding:0;font-size:14px;color:#1a1008;line-height:1.5">${startTime} – ${endTime} hrs</p>
                                      </td>
                                    </tr></tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- Botón -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:0 52px 44px">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;padding:0">
                            <tbody><tr style="margin:0;padding:0">
                              <td style="margin:0;padding:0;background:#3a2208">
                                <p style="margin:0;padding:0">
                                  <a href="${waUrl}" rel="noopener noreferrer" target="_blank"
                                     style="color:#f0e6d3;text-decoration:none;display:inline-block;padding:14px 32px;
                                            font-size:10px;letter-spacing:3px;text-transform:uppercase;
                                            font-family:Arial,Helvetica,sans-serif">
                                    Confirmar mi cita
                                  </a>
                                </p>
                              </td>
                            </tr></tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- Footer line -->
                      <tr style="margin:0;padding:0">
                        <td style="margin:0;padding:20px 52px;border-top:1px solid #ece8e3"></td>
                      </tr>

                    </tbody>
                  </table>
                </td>
              </tr></tbody>
            </table>
          </td></tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </body>
</html>`;
}

function buildICS({ name, treatmentList, date, startTime, endTime }: {
  name: string; treatmentList: string; date: string; startTime: string; endTime: string; durationMinutes: number;
}) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@nucleoclinique.com`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtStart = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
  const dtEnd   = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nucleo Clinique//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Mexico_City:${dtStart}`,
    `DTEND;TZID=America/Mexico_City:${dtEnd}`,
    `SUMMARY:Núcleo Clinique · ${name}`,
    `DESCRIPTION:Tratamiento: ${treatmentList}\\nCliente: ${name}`,
    'ORGANIZER;CN=Núcleo Clinique:mailto:no-reply@nucleoclinique.com',
    'ATTENDEE;CN=Roberta;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION:mailto:roberta@nucleoclinique.com',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function buildSpaEmail({ name, email, phone, treatmentList, dateFormatted, startTime, endTime }: {
  name: string; email: string; phone?: string; treatmentList: string;
  dateFormatted: string; startTime: string; endTime: string;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px;">
  <div style="max-width:480px;background:#fff;border-radius:4px;padding:24px;border:1px solid #e0e0e0;">
    <p style="margin:0 0 4px;font-size:18px;font-weight:bold;color:#1a0e06;">Nueva cita agendada</p>
    <p style="margin:0 0 20px;font-size:13px;color:#888;">${dateFormatted} · ${startTime} – ${endTime}</p>
    <table width="100%" cellpadding="6" cellspacing="0">
      <tr><td style="color:#555;font-size:13px;width:120px;">Tratamiento</td><td style="font-size:13px;font-weight:bold;">${treatmentList}</td></tr>
      <tr><td style="color:#555;font-size:13px;">Cliente</td><td style="font-size:13px;">${name}</td></tr>
      <tr><td style="color:#555;font-size:13px;">Email</td><td style="font-size:13px;">${email}</td></tr>
      <tr><td style="color:#555;font-size:13px;">Teléfono</td><td style="font-size:13px;">${phone || 'No proporcionado'}</td></tr>
    </table>
  </div>
</body>
</html>`;
}

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const TIMEZONE = 'America/Mexico_City';

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
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
  try {
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

    // Verificar que las credenciales están presentes
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('[/api/book] Faltan credenciales de Google en .env.local');
      return NextResponse.json({ error: 'Configuración de calendario incompleta' }, { status: 500 });
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const treatmentList = Array.isArray(treatments) ? treatments.join(', ') : treatments;

    const event = {
      summary: `NucleoSpa · ${name}`,
      description: [
        `Tratamiento(s): ${treatmentList}`,
        `Duración: ${durationMinutes} min`,
        `Cliente: ${name}`,
        `Correo: ${email}`,
        `Teléfono: ${phone || 'No proporcionado'}`,
      ].join('\n'),
      start: {
        dateTime: buildDateTime(date, startTime),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: buildDateTime(date, endTime),
        timeZone: TIMEZONE,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email' as const, minutes: 24 * 60 },
          { method: 'popup' as const, minutes: 60 },
        ],
      },
    };

    console.log('[/api/book] Creando evento:', {
      calendarId,
      serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      start: event.start.dateTime,
      end: event.end.dateTime,
      summary: event.summary,
    });

    const result = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'none',
    });

    console.log('[/api/book] Evento creado:', result.data.id, result.data.htmlLink);

    return NextResponse.json({ ok: true, eventId: result.data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Loggear el error completo para diagnóstico
    console.error('[/api/book] Error:', message);
    if (err && typeof err === 'object' && 'response' in err) {
      const apiErr = err as { response?: { data?: unknown } };
      console.error('[/api/book] Google API response:', JSON.stringify(apiErr.response?.data));
    }
    return NextResponse.json({ error: message || 'Error al crear el evento' }, { status: 500 });
  }
}

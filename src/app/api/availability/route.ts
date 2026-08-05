import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

function toMexicoHHMM(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/^24:/, '00:');
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json({ busy: [] });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Cubrir el día completo — usar el offset más amplio para no perder eventos
    const response = await calendar.events.list({
      calendarId,
      timeMin: `${date}T00:00:00-06:00`,
      timeMax: `${date}T23:59:59-06:00`,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const items = response.data.items ?? [];
    console.log(`[availability] ${date} → ${items.length} eventos en calendario ${calendarId}`);

    const busy = items
      .filter(e => e.status !== 'cancelled' && e.start?.dateTime && e.end?.dateTime)
      .map(e => {
        const start = toMexicoHHMM(e.start!.dateTime!);
        const end   = toMexicoHHMM(e.end!.dateTime!);
        console.log(`  evento: ${start} – ${end}`);
        return { start, end };
      });

    return NextResponse.json({ busy });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[availability] error:', msg);
    return NextResponse.json({ busy: [], error: msg });
  }
}

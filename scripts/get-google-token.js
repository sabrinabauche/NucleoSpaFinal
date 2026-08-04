/**
 * Script de configuración única para obtener el Refresh Token de Google Calendar.
 *
 * PASOS PREVIOS (Google Cloud Console):
 * 1. Ve a https://console.cloud.google.com y crea un proyecto
 * 2. Habilita la API: Biblioteca → "Google Calendar API" → Habilitar
 * 3. Crea credenciales: APIs y servicios → Credenciales → Crear credenciales → ID de cliente OAuth
 *    - Tipo de aplicación: Aplicación web
 *    - URI de redireccionamiento autorizado: http://localhost:3000/oauth2callback
 * 4. Descarga el JSON o copia Client ID y Client Secret
 * 5. En la pantalla de consentimiento, agrega tu correo como usuario de prueba
 *
 * CÓMO USAR ESTE SCRIPT:
 *   node scripts/get-google-token.js
 *
 * Luego abre la URL que imprime, autoriza, copia el código de la URL de retorno
 * y pégalo cuando te lo pida. El script imprimirá tu refresh_token.
 */

const { google } = require('googleapis');
const readline = require('readline');

// ── CONFIGURA ESTOS VALORES ──────────────────────────────────────────
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'PEGA_TU_CLIENT_ID_AQUI';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'PEGA_TU_CLIENT_SECRET_AQUI';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
// ─────────────────────────────────────────────────────────────────────

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\n──────────────────────────────────────────────');
console.log('1. Abre esta URL en tu navegador:');
console.log('\n' + authUrl + '\n');
console.log('2. Acepta los permisos con tu cuenta de Google.');
console.log('3. Serás redirigido a una URL como:');
console.log('   http://localhost:3000/oauth2callback?code=4/0AX4XfW...');
console.log('4. Copia el valor del parámetro "code" y pégalo abajo.');
console.log('──────────────────────────────────────────────\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Pega el código aquí: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(decodeURIComponent(code.trim()));
    console.log('\n✅ ¡Listo! Agrega estas líneas a tu archivo .env.local:\n');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_CALENDAR_ID=primary\n`);
  } catch (err) {
    console.error('Error al obtener el token:', err.message);
  }
});

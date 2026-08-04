# Configuración Google Calendar — Service Account

## Lo que ya tienes ✓
- Proyecto en Google Cloud Console
- Google Calendar API habilitada
- Service Account: `nucleo@nucleo-499100.iam.gserviceaccount.com`

---

## Pasos que faltan

### 1. Descargar la llave JSON de la Service Account
1. En Google Cloud Console → IAM y administración → Cuentas de servicio
2. Haz clic en `nucleo@nucleo-499100.iam.gserviceaccount.com`
3. Tab **Claves** → **Agregar clave** → **Crear clave nueva** → JSON
4. Se descargará un archivo `.json` — guárdalo en lugar seguro (no lo subas a git)

El JSON tiene esta estructura:
```json
{
  "type": "service_account",
  "project_id": "nucleo-499100",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMII...\n-----END RSA PRIVATE KEY-----\n",
  "client_email": "nucleo@nucleo-499100.iam.gserviceaccount.com",
  ...
}
```

### 2. Compartir tu calendario con la Service Account
1. Abre **Google Calendar** (calendar.google.com) con tu cuenta personal
2. En el panel izquierdo, busca tu calendario → tres puntos → **Configuración y uso compartido**
3. Sección **Compartir con personas específicas** → **Agregar personas**
4. Agrega: `nucleo@nucleo-499100.iam.gserviceaccount.com`
5. Permiso: **Realizar cambios en eventos**
6. Guarda

### 3. Crear el archivo .env.local
Copia `.env.local.example` → `.env.local` y llena:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=nucleo@nucleo-499100.iam.gserviceaccount.com

GOOGLE_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMII...\n-----END RSA PRIVATE KEY-----\n

GOOGLE_CALENDAR_ID=sabrinabauche@gmail.com
```

> **Importante con GOOGLE_PRIVATE_KEY:**
> Copia el valor exacto del campo `"private_key"` del JSON.
> Los saltos de línea aparecen como `\n` — déjalos así, el código los convierte automáticamente.

### 4. Reiniciar el servidor
```bash
npm run dev
```

---

## Verificar que funciona
Haz una reserva de prueba en la página. Si todo está bien, aparecerá un evento en tu Google Calendar con:
- Título: `NucleoSpa · [nombre del cliente]`
- Descripción: tratamientos, duración, contacto
- Invitación enviada al correo del cliente
- Recordatorio 24h antes por email y 1h antes como popup

## Para cambiar al calendario de negocio
Cuando tengas la cuenta del spa, solo cambia en `.env.local`:
```env
GOOGLE_CALENDAR_ID=correo-del-negocio@gmail.com
```
Y comparte ese calendario nuevo con la service account.

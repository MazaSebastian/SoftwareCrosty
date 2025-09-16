# Configuración de Variables de Entorno en Vercel

## 🚨 IMPORTANTE: Configurar variables de entorno en Vercel

Para que Supabase funcione en producción, necesitas configurar las variables de entorno en Vercel.

## 📋 Pasos para configurar:

### 1. Ir al Dashboard de Vercel
- Ve a: https://vercel.com/dashboard
- Selecciona tu proyecto: "software-crosty"

### 2. Configurar Environment Variables
- Ve a: Settings → Environment Variables
- Agrega estas variables:

```
REACT_APP_SUPABASE_URL = https://dnxpzybiucxghmdxnmtt.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRueHB6eWJpdWN4Z2htZHhubXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTU2NTQsImV4cCI6MjA3MzYzMTY1NH0.Q-U7wUMpsm8KzHwRgBzDPLE9FnxX-CirBTStRJ9LKw8
```

### 3. Hacer redeploy
- Después de agregar las variables, haz un nuevo deploy
- Las variables se aplicarán en el próximo build

## ✅ Verificación:
- Ve a la sección "Supabase" en la aplicación
- Haz clic en "Verificar Conexión"
- Debería mostrar "Conectado" en verde

## 🔒 Seguridad:
- Las variables de entorno no se suben a GitHub
- Solo se configuran en Vercel para producción
- El archivo .env es solo para desarrollo local

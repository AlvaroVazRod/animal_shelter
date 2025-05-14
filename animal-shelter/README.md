
# 🌐 Configurar ngrok para exponer el backend de Spring Boot

Esta guía te permite compartir tu backend local (http://localhost:8080) con tu equipo o servicios externos como Stripe, usando [ngrok](https://ngrok.com).

---

## ✅ Requisitos

- Tener tu backend corriendo localmente (Spring Boot en el puerto 8080)
- Tener una cuenta gratuita en [ngrok.com](https://ngrok.com)

---

## 🧩 1. Instalar ngrok

Descarga desde: https://ngrok.com/download

### Windows

Descomprime el ZIP y colócalo en `C:\ngrok\ngrok.exe`, o en una ruta global como `C:\Windows`.

### Linux / Mac

```bash
sudo mv ngrok /usr/local/bin
chmod +x /usr/local/bin/ngrok
```

---

## 🔐 2. Autenticarse con ngrok

Copia tu token desde: https://dashboard.ngrok.com/get-started/setup

Luego, en terminal:

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

---

## 🚀 3. Correr tu backend localmente

Inicia tu proyecto Spring Boot:

```
http://localhost:8080
```

---

## 🌍 4. Iniciar ngrok

En una nueva terminal:

```bash
ngrok http 8080
```

Verás algo así:

```
Forwarding https://abc123.ngrok.io -> http://localhost:8080
```

---

## 🔗 5. Usar la URL pública

- En Stripe: configura el webhook en `https://abc123.ngrok.io/webhook`
- En Postman o frontend: reemplaza `http://localhost:8080` por la URL pública.

---

## 📝 Notas

- La URL cambia cada vez que reinicias ngrok (excepto en planes pagos).
- Si usas seguridad con Spring Security, asegúrate de permitir `/webhook` sin autenticación.

---

## 🧪 Ejemplo de prueba rápida

```bash
stripe listen --forward-to https://abc123.ngrok.io/webhook
stripe trigger payment_intent.succeeded
```

# animal_shelter
Aplicacion desarrollo refugio de animales.

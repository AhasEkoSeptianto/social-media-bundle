# Express Google Auth API

Backend Express.js dengan login Google OAuth (verifikasi ID token), session berbasis JWT + httpOnly cookie, dan struktur folder skalabel (layered: routes → controllers → services → models).

## Struktur Folder

```
src/
  config/       -> koneksi DB & environment variables
  controllers/  -> menerima request, panggil service, kirim response
  middleware/   -> auth guard, error handler
  models/       -> schema Mongoose
  routes/       -> definisi endpoint
  services/     -> business logic (verifikasi Google, JWT, dsb)
  utils/        -> helper (logger, AppError)
  app.js        -> setup Express app & middleware
  server.js     -> entry point, jalankan server + connect DB
tests/          -> unit/integration test (Jest + Supertest)
```

## Setup

```bash
npm install
cp .env.example .env   # lalu isi GOOGLE_CLIENT_ID dan JWT_SECRET
npm run dev
```

## Endpoint

| Method | Endpoint            | Deskripsi                                  | Auth |
|--------|---------------------|---------------------------------------------|------|
| POST   | /api/auth/google     | Login/register via Google ID token          | -    |
| GET    | /api/auth/me         | Ambil data user yang sedang login           | ✅   |
| POST   | /api/auth/logout     | Hapus session cookie                        | -    |
| GET    | /health              | Health check                                | -    |

### Contoh request login

```bash
curl -X POST http://localhost:4000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "<GOOGLE_ID_TOKEN_DARI_FRONTEND>"}'
```

## Alur Autentikasi

1. Frontend memakai Google Identity Services untuk dapat `idToken`.
2. Frontend kirim `idToken` ke `POST /api/auth/google`.
3. Backend verifikasi token via `google-auth-library`, cari/buat user di DB.
4. Backend generate JWT session, simpan sebagai `httpOnly` cookie.
5. Request selanjutnya ke endpoint yang dilindungi (`requireAuth`) otomatis terautentikasi lewat cookie.

## Menambah fitur baru

Ikuti pola yang sama: `routes/xxx.routes.js` → `controllers/xxx.controller.js` → `services/xxx.service.js` → `models/xxx.model.js`, lalu daftarkan route barunya di `src/routes/index.js`.

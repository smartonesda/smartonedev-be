# SmartOneDev Backend API

Backend API untuk website SmartOneDev - Gallery karya siswa RPL SMK.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT

## 📁 Struktur Folder

```
backend/
├── config/
│   └── supabase.js         # Konfigurasi Supabase client
├── controllers/
│   ├── authController.js   # Login/logout logic
│   └── galleryController.js # CRUD gallery
├── database/
│   └── schema.sql          # SQL schema + dummy data
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   └── adminMiddleware.js  # Admin role check
├── models/
│   └── Gallery.js          # Gallery model (Supabase)
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   └── galleryRoutes.js    # Gallery endpoints
├── server.js               # Entry point
├── package.json
├── vercel.json             # Vercel deployment config
└── README.md
```

## ⚙️ Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Buat file `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. Setup Supabase Database

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `database/schema.sql`
3. Jalankan query untuk membuat tabel dan data dummy

### 4. Setup Supabase Storage

1. Buat bucket baru: `gallery-images`
2. Set bucket sebagai **Public**
3. Tambahkan policies:
   - **allow_public_read** (SELECT): `bucket_id = 'gallery-images'`
   - **allow_public_insert** (INSERT): `bucket_id = 'gallery-images'`

### 5. Jalankan Server

```bash
# Development
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Gallery (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | Get all projects |
| GET | `/api/gallery/:id` | Get project by ID |

### Gallery (Protected - Admin Only)

Semua endpoint protected memerlukan header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/gallery` | Create project |
| PUT | `/api/gallery/:id` | Update project |
| DELETE | `/api/gallery/:id` | Delete project |
| POST | `/api/gallery/upload` | Upload image |

### Upload Image

**Request:**
- Method: `POST`
- URL: `/api/gallery/upload`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/gallery-images/123456.jpg",
    "filename": "123456.jpg"
  }
}
```

## 📊 Data Structure

### Gallery Object

```json
{
  "id": "uuid",
  "title": "Sistem Presensi QR",
  "slug": "sistem-presensi-qr",
  "category": "Web App",
  "description": "Deskripsi project...",
  "image": "https://...",
  "screenshots": [
    { "url": "https://...", "caption": "Dashboard" }
  ],
  "story": {
    "problem": "Masalah yang diselesaikan",
    "solution": "Solusi yang ditawarkan",
    "impact": "Dampak positif"
  },
  "timeline": [
    { "date": "Okt 2024", "event": "Development", "description": "..." }
  ],
  "team": [
    { "name": "Ahmad", "role": "Developer", "avatar": null }
  ],
  "tech": ["Laravel", "MySQL"],
  "author": "RPL Angkatan 24",
  "stars": 120,
  "collab_open": true,
  "bg_gradient": "from-red-600 to-red-900",
  "icon": "globe",
  "github_url": "https://github.com/...",
  "demo_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🚀 Deployment (Vercel)

1. Push ke GitHub
2. Import repository di Vercel
3. Set Environment Variables di Vercel Dashboard
4. Deploy!

Lihat `DEPLOYMENT_GUIDE.md` di root folder untuk panduan lengkap.

## 📝 License

MIT License - SmartOneDev Team

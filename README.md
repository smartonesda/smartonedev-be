# SmartOneDev Backend API

Backend API untuk website SmartOneDev - Gallery karya siswa RPL SMKS Antartika 1 Sidoarjo.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: Google Cloud Firestore (Firebase Admin SDK)
- **Image Storage**: Cloudinary (Free Tier)
- **Authentication**: JWT (`jsonwebtoken` + `bcryptjs`)

## Struktur Folder

```
backend/
├── config/
│   ├── cloudinary.js         # Konfigurasi upload/delete gambar Cloudinary
│   ├── firebase.js           # Konfigurasi Firebase Admin SDK (Cloud Firestore)
│   └── jwt.js                # Konfigurasi JWT
├── controllers/
│   ├── authController.js     # Login & session verification
│   ├── categoryController.js # CRUD kategori
│   └── galleryController.js  # CRUD gallery + upload/delete gambar
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── adminMiddleware.js    # Admin role check
├── models/
│   ├── Category.js           # Category model (Firestore)
│   ├── Gallery.js            # Gallery model (Firestore + Cloudinary)
│   └── User.js               # User model (Firestore)
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── categoryRoutes.js     # Category endpoints
│   └── galleryRoutes.js      # Gallery endpoints
├── scripts/
│   ├── backup.js             # Export Firestore ke file JSON lokal
│   ├── restore.js            # Restore Firestore dari file backup JSON
│   └── seed.js               # Seed akun admin, kategori default, & sample data
├── server.js                 # Entry point
├── package.json
└── vercel.json               # Vercel deployment config
```

## Instalasi & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` menjadi `.env`, lalu isi kredensial:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK (dari Firebase Console -> Project Settings -> Service Accounts)
FIREBASE_PROJECT_ID=smartonedev-sda
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@smartonedev-sda.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Alternatif lokal: simpan JSON Service Account sebagai backend/serviceAccountKey.json
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=smartonedev/gallery

# JWT & Admin Default
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=smartonedev
ADMIN_PASSWORD=your-secure-password
```

### 3. Seed Data Awal Firestore

```bash
# Seed admin user + 4 kategori default (Web App, Mobile, Game, IoT)
npm run seed

# Atau sekalian dengan 6 sample project dummy
npm run seed:samples
```

### 4. Backup & Restore Database

```bash
# Export seluruh collection Firestore ke backend/backups/firestore-backup-*.json
npm run backup

# Restore dari file backup JSON
npm run restore -- backups/firestore-backup-2026-xx-xx.json
```

### 5. Jalankan Server

```bash
# Development
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get authenticated admin info (protected) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category if unused (admin) |

### Gallery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | Get all projects |
| GET | `/api/gallery/slug/:slug` | Get project by slug |
| GET | `/api/gallery/:id` | Get project by ID |
| POST | `/api/gallery` | Create project (admin) |
| PUT | `/api/gallery/:id` | Update project (admin) |
| DELETE | `/api/gallery/:id` | Delete project (admin) |
| POST | `/api/gallery/upload` | Upload image to Cloudinary (admin) |
| DELETE | `/api/gallery/image/:filename` | Delete image from Cloudinary (admin) |

## Deployment (Vercel)

Lihat [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) di root folder untuk panduan lengkap.

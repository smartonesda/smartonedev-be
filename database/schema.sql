-- ============================================
-- SmartOneDev Gallery Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Drop tables if exists (for fresh install)
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS categories;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    color VARCHAR(50) DEFAULT '#dc2626',
    icon VARCHAR(50) DEFAULT 'folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, color, icon) VALUES
('Web App', 'web-app', '#dc2626', 'globe'),
('Mobile', 'mobile', '#f59e0b', 'smartphone'),
('Game', 'game', '#10b981', 'gamepad-2'),
('IoT', 'iot', '#3b82f6', 'cpu');

-- ============================================
-- GALLERY TABLE
-- ============================================

-- Create gallery table
CREATE TABLE gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(100) NOT NULL DEFAULT 'Web App',
    description TEXT,
    image TEXT,
    screenshots JSONB DEFAULT '[]',
    story JSONB DEFAULT '{}',
    timeline JSONB DEFAULT '[]',
    team JSONB DEFAULT '[]',
    tech JSONB DEFAULT '[]',
    author VARCHAR(255),
    stars INTEGER DEFAULT 0,
    collab_open BOOLEAN DEFAULT false,
    bg_gradient VARCHAR(100) DEFAULT 'from-red-600 to-red-900',
    icon VARCHAR(50) DEFAULT 'globe',
    github_url TEXT,
    demo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_slug ON gallery(slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA / DUMMY DATA
-- ============================================

INSERT INTO gallery (title, slug, category, description, image, screenshots, story, timeline, team, tech, author, stars, collab_open, bg_gradient, icon, github_url, demo_url) VALUES

-- Project 1: Sistem Presensi QR
(
    'Sistem Presensi QR',
    'sistem-presensi-qr',
    'Web App',
    'Aplikasi absensi siswa menggunakan QR Code terintegrasi WhatsApp gateway.',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", "caption": "Dashboard Admin - Monitoring kehadiran real-time"},
        {"url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", "caption": "Halaman Scan QR - Interface untuk absensi siswa"},
        {"url": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80", "caption": "Laporan - Export data kehadiran bulanan"}
    ]',
    '{"problem": "Absensi manual di sekolah memakan waktu lama dan rentan manipulasi. Orang tua juga tidak mendapat informasi real-time tentang kehadiran anak mereka.", "solution": "Kami membangun sistem absensi berbasis QR Code yang terintegrasi dengan WhatsApp, sehingga orang tua langsung menerima notifikasi saat anak mereka tiba di sekolah.", "impact": "Waktu absensi berkurang dari 15 menit menjadi 2 menit per kelas. 95% orang tua merasa lebih tenang dengan notifikasi real-time."}',
    '[
        {"date": "September 2024", "event": "Riset & Planning", "description": "Analisis kebutuhan dan desain sistem"},
        {"date": "Oktober 2024", "event": "Development", "description": "Pengembangan backend dan integrasi WhatsApp API"},
        {"date": "November 2024", "event": "Testing & Launch", "description": "UAT dan deployment ke server sekolah"}
    ]',
    '[
        {"name": "Ahmad Rizki", "role": "Project Lead", "avatar": null},
        {"name": "Siti Nurhaliza", "role": "Backend Developer", "avatar": null},
        {"name": "Budi Santoso", "role": "Frontend Developer", "avatar": null},
        {"name": "Dewi Lestari", "role": "UI/UX Designer", "avatar": null}
    ]',
    '["Laravel", "MySQL", "Bootstrap", "WhatsApp API"]',
    'RPL Angkatan 24',
    120,
    true,
    'from-red-600 to-red-900',
    'globe',
    'https://github.com/smartonesda/presensi-qr',
    NULL
),

-- Project 2: Antartika Learning
(
    'Antartika Learning',
    'antartika-learning',
    'Mobile',
    'Aplikasi E-Learning berbasis Android untuk materi produktif RPL.',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", "caption": "Home Screen - Pilihan materi pembelajaran"},
        {"url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", "caption": "Video Player - Materi dalam format video"},
        {"url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80", "caption": "Quiz - Evaluasi pemahaman siswa"}
    ]',
    '{"problem": "Siswa kesulitan mengakses materi pelajaran produktif RPL di luar jam sekolah. Buku paket terbatas dan tidak interaktif.", "solution": "Aplikasi mobile yang menyediakan materi pelajaran dalam format video, artikel, dan quiz interaktif yang bisa diakses kapan saja.", "impact": "Nilai rata-rata siswa meningkat 15%. 80% siswa merasa lebih mudah memahami materi dengan format video."}',
    '[
        {"date": "Agustus 2024", "event": "Ideation", "description": "Brainstorming fitur dan UI/UX design"},
        {"date": "September 2024", "event": "Development", "description": "Pengembangan aplikasi mobile dengan Flutter"},
        {"date": "Oktober 2024", "event": "Beta Testing", "description": "Testing dengan 50 siswa kelas X"}
    ]',
    '[
        {"name": "Rina Wulandari", "role": "Project Manager", "avatar": null},
        {"name": "Dimas Prasetyo", "role": "Mobile Developer", "avatar": null},
        {"name": "Anisa Rahma", "role": "Content Creator", "avatar": null}
    ]',
    '["Flutter", "Firebase", "Dart"]',
    'Dev Team A',
    85,
    false,
    'from-red-500 to-stone-900',
    'smartphone',
    'https://github.com/smartonesda/antartika-learning',
    NULL
),

-- Project 3: Space Shooter SDA
(
    'Space Shooter SDA',
    'space-shooter-sda',
    'Game',
    'Game edukasi pengenalan sejarah Sidoarjo dengan tema luar angkasa.',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", "caption": "Gameplay - Tembak asteroid sambil jawab quiz"},
        {"url": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80", "caption": "Level Selection - Pilih era sejarah"},
        {"url": "https://images.unsplash.com/photo-1493711662062-fa541f7f26a7?w=800&q=80", "caption": "Leaderboard - Kompetisi antar pemain"}
    ]',
    '{"problem": "Siswa menganggap pelajaran sejarah lokal membosankan. Kurangnya media pembelajaran yang menarik untuk generasi digital.", "solution": "Game arcade shooter yang mengintegrasikan quiz sejarah Sidoarjo. Setiap level mewakili era berbeda dalam sejarah kota.", "impact": "Game dimainkan oleh 500+ siswa. 90% pemain mengaku jadi lebih tertarik dengan sejarah lokal."}',
    '[
        {"date": "Juli 2024", "event": "Concept Art", "description": "Desain karakter dan environment"},
        {"date": "Agustus 2024", "event": "Game Development", "description": "Programming gameplay mechanics"},
        {"date": "September 2024", "event": "Content Integration", "description": "Integrasi materi sejarah ke dalam game"},
        {"date": "Oktober 2024", "event": "Publishing", "description": "Release di Play Store"}
    ]',
    '[
        {"name": "Farhan Hakim", "role": "Game Designer", "avatar": null},
        {"name": "Putri Ayu", "role": "2D Artist", "avatar": null},
        {"name": "Reza Mahendra", "role": "Programmer", "avatar": null},
        {"name": "Nadia Safitri", "role": "Sound Designer", "avatar": null}
    ]',
    '["Unity", "C#", "Photoshop"]',
    'Game Dev Club',
    200,
    true,
    'from-amber-600 to-red-900',
    'gamepad-2',
    'https://github.com/smartonesda/space-shooter',
    'https://play.google.com/store/apps/details?id=com.smartone.spaceshooter'
),

-- Project 4: Smart Canteen
(
    'Smart Canteen',
    'smart-canteen',
    'IoT',
    'Sistem pembayaran kantin cashless menggunakan kartu RFID siswa.',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80", "caption": "RFID Reader - Tap kartu untuk pembayaran"},
        {"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", "caption": "Dashboard - Monitoring penjualan real-time"},
        {"url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", "caption": "Mobile App - Top up saldo via aplikasi"}
    ]',
    '{"problem": "Antrian panjang di kantin karena pembayaran tunai. Siswa sering kehilangan uang atau lupa membawa uang saku.", "solution": "Sistem pembayaran cashless menggunakan kartu RFID yang sudah dimiliki siswa untuk absensi. Orang tua bisa top up saldo via aplikasi.", "impact": "Waktu transaksi berkurang 70%. Tidak ada lagi kasus kehilangan uang. Orang tua bisa monitor pengeluaran anak."}',
    '[
        {"date": "Agustus 2024", "event": "Hardware Setup", "description": "Perakitan dan programming Arduino + RFID reader"},
        {"date": "September 2024", "event": "Backend Development", "description": "API server dan database design"},
        {"date": "Oktober 2024", "event": "Frontend & Mobile", "description": "Dashboard admin dan aplikasi orang tua"},
        {"date": "November 2024", "event": "Pilot Testing", "description": "Uji coba di kantin sekolah"}
    ]',
    '[
        {"name": "Yoga Pratama", "role": "Hardware Engineer", "avatar": null},
        {"name": "Sinta Dewi", "role": "Backend Developer", "avatar": null},
        {"name": "Andi Wijaya", "role": "Frontend Developer", "avatar": null},
        {"name": "Maya Sari", "role": "Mobile Developer", "avatar": null}
    ]',
    '["Arduino", "Node.js", "React", "MySQL"]',
    'IoT Division',
    156,
    true,
    'from-orange-600 to-red-800',
    'cpu',
    'https://github.com/smartonesda/smart-canteen',
    NULL
),

-- Project 5: Portfolio Generator
(
    'Portfolio Generator',
    'portfolio-generator',
    'Web App',
    'Platform untuk generate CV dan portfolio siswa otomatis.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", "caption": "Template Selection - Pilih desain portfolio"},
        {"url": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80", "caption": "Editor - Kustomisasi konten portfolio"},
        {"url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", "caption": "Preview - Lihat hasil portfolio"}
    ]',
    '{"problem": "Siswa SMK kesulitan membuat CV dan portfolio profesional untuk melamar kerja atau PKL. Tidak semua siswa menguasai desain grafis.", "solution": "Platform web yang memungkinkan siswa mengisi data dan otomatis generate CV serta portfolio dengan template profesional.", "impact": "200+ siswa berhasil membuat portfolio. 30% peningkatan penerimaan PKL di perusahaan partner."}',
    '[
        {"date": "September 2024", "event": "UI/UX Design", "description": "Desain template portfolio dan flow aplikasi"},
        {"date": "Oktober 2024", "event": "Development", "description": "Full-stack development dengan React dan Node.js"},
        {"date": "November 2024", "event": "Launch", "description": "Soft launch untuk siswa kelas XII"}
    ]',
    '[
        {"name": "Putra Wijaya", "role": "Full Stack Developer", "avatar": null},
        {"name": "Laras Setiawati", "role": "UI/UX Designer", "avatar": null}
    ]',
    '["React", "Tailwind", "Node.js", "MongoDB"]',
    'Putra & Friends',
    92,
    true,
    'from-red-500 to-amber-700',
    'layout',
    'https://github.com/smartonesda/portfolio-generator',
    'https://portfolio.smartonedev.com'
),

-- Project 6: Perpus Digital
(
    'Perpus Digital',
    'perpus-digital',
    'Web App',
    'Manajemen peminjaman buku perpustakaan online.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    '[
        {"url": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80", "caption": "Katalog Buku - Cari dan filter buku"},
        {"url": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80", "caption": "Detail Buku - Informasi lengkap dan ketersediaan"},
        {"url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80", "caption": "Histori Peminjaman - Tracking buku yang dipinjam"}
    ]',
    '{"problem": "Sistem peminjaman buku perpustakaan masih manual dengan buku besar. Siswa tidak tahu buku apa saja yang tersedia tanpa datang ke perpustakaan.", "solution": "Sistem digital untuk katalog buku, peminjaman online, dan notifikasi jatuh tempo. Siswa bisa reservasi buku dari rumah.", "impact": "Kunjungan perpustakaan meningkat 40%. Tidak ada lagi buku hilang karena tracking digital."}',
    '[
        {"date": "Agustus 2024", "event": "Requirements Gathering", "description": "Interview dengan petugas perpustakaan"},
        {"date": "September 2024", "event": "Development", "description": "Pembangunan sistem dengan PHP dan MySQL"},
        {"date": "Oktober 2024", "event": "Data Migration", "description": "Input data 2000+ buku ke sistem"}
    ]',
    '[
        {"name": "Bagas Aditya", "role": "Backend Developer", "avatar": null},
        {"name": "Citra Permata", "role": "Frontend Developer", "avatar": null},
        {"name": "Erik Saputra", "role": "Database Admin", "avatar": null}
    ]',
    '["PHP Native", "MySQL", "Bootstrap"]',
    'Kelas X RPL 1',
    45,
    false,
    'from-stone-700 to-red-900',
    'book-open',
    'https://github.com/smartonesda/perpus-digital',
    NULL
);

-- ============================================
-- SUPABASE STORAGE POLICIES
-- Run this in SQL Editor after creating bucket 'gallery-images'
-- OR setup manually via Supabase Dashboard > Storage > Policies
-- ============================================

-- 1. Allow public READ access (for displaying images)
CREATE POLICY "allow_public_read" ON storage.objects 
FOR SELECT USING (bucket_id = 'gallery-images');

-- 2. Allow public INSERT (for uploading images)
CREATE POLICY "allow_public_insert" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

-- 3. Allow public UPDATE (for replacing images)
CREATE POLICY "allow_public_update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'gallery-images');

-- 4. Allow public DELETE (for removing images)
CREATE POLICY "allow_public_delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'gallery-images');


ALTER TABLE gallery
ADD COLUMN login_credentials JSONB DEFAULT '[]'::jsonb;

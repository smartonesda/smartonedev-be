import dotenv from 'dotenv'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Gallery from '../models/Gallery.js'

dotenv.config()

const DEFAULT_CATEGORIES = [
    { name: 'Web App', color: '#dc2626', icon: 'globe' },
    { name: 'Mobile', color: '#f59e0b', icon: 'smartphone' },
    { name: 'Game', color: '#10b981', icon: 'gamepad-2' },
    { name: 'IoT', color: '#3b82f6', icon: 'cpu' }
]

const SAMPLE_PROJECTS = [
    {
        title: 'Sistem Presensi QR',
        slug: 'sistem-presensi-qr',
        category: 'Web App',
        description: 'Aplikasi absensi siswa menggunakan QR Code terintegrasi WhatsApp gateway.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', caption: 'Dashboard Admin - Monitoring kehadiran real-time' },
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', caption: 'Halaman Scan QR - Interface untuk absensi siswa' },
            { url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', caption: 'Laporan - Export data kehadiran bulanan' }
        ],
        story: {
            problem: 'Absensi manual di sekolah memakan waktu lama dan rentan manipulasi. Orang tua juga tidak mendapat informasi real-time tentang kehadiran anak mereka.',
            solution: 'Kami membangun sistem absensi berbasis QR Code yang terintegrasi dengan WhatsApp, sehingga orang tua langsung menerima notifikasi saat anak mereka tiba di sekolah.',
            impact: 'Waktu absensi berkurang dari 15 menit menjadi 2 menit per kelas. 95% orang tua merasa lebih tenang dengan notifikasi real-time.'
        },
        timeline: [
            { date: 'September 2024', event: 'Riset & Planning', description: 'Analisis kebutuhan dan desain sistem' },
            { date: 'Oktober 2024', event: 'Development', description: 'Pengembangan backend dan integrasi WhatsApp API' },
            { date: 'November 2024', event: 'Testing & Launch', description: 'UAT dan deployment ke server sekolah' }
        ],
        team: [
            { name: 'Ahmad Rizki', role: 'Project Lead', avatar: null },
            { name: 'Siti Nurhaliza', role: 'Backend Developer', avatar: null },
            { name: 'Budi Santoso', role: 'Frontend Developer', avatar: null },
            { name: 'Dewi Lestari', role: 'UI/UX Designer', avatar: null }
        ],
        tech: ['Laravel', 'MySQL', 'Bootstrap', 'WhatsApp API'],
        author: 'RPL Angkatan 24',
        stars: 120,
        collab_open: true,
        bg_gradient: 'from-red-600 to-red-900',
        icon: 'globe',
        github_url: 'https://github.com/smartonesda/presensi-qr',
        demo_url: null,
        login_credentials: []
    },
    {
        title: 'Antartika Learning',
        slug: 'antartika-learning',
        category: 'Mobile',
        description: 'Aplikasi E-Learning berbasis Android untuk materi produktif RPL.',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', caption: 'Home Screen - Pilihan materi pembelajaran' },
            { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', caption: 'Video Player - Materi dalam format video' },
            { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80', caption: 'Quiz - Evaluasi pemahaman siswa' }
        ],
        story: {
            problem: 'Siswa kesulitan mengakses materi pelajaran produktif RPL di luar jam sekolah. Buku paket terbatas dan tidak interaktif.',
            solution: 'Aplikasi mobile yang menyediakan materi pelajaran dalam format video, artikel, dan quiz interaktif yang bisa diakses kapan saja.',
            impact: 'Nilai rata-rata siswa meningkat 15%. 80% siswa merasa lebih mudah memahami materi dengan format video.'
        },
        timeline: [
            { date: 'Agustus 2024', event: 'Ideation', description: 'Brainstorming fitur dan UI/UX design' },
            { date: 'September 2024', event: 'Development', description: 'Pengembangan aplikasi mobile dengan Flutter' },
            { date: 'Oktober 2024', event: 'Beta Testing', description: 'Testing dengan 50 siswa kelas X' }
        ],
        team: [
            { name: 'Rina Wulandari', role: 'Project Manager', avatar: null },
            { name: 'Dimas Prasetyo', role: 'Mobile Developer', avatar: null },
            { name: 'Anisa Rahma', role: 'Content Creator', avatar: null }
        ],
        tech: ['Flutter', 'Firebase', 'Dart'],
        author: 'Dev Team A',
        stars: 85,
        collab_open: false,
        bg_gradient: 'from-red-500 to-stone-900',
        icon: 'smartphone',
        github_url: 'https://github.com/smartonesda/antartika-learning',
        demo_url: null,
        login_credentials: []
    },
    {
        title: 'Space Shooter SDA',
        slug: 'space-shooter-sda',
        category: 'Game',
        description: 'Game edukasi pengenalan sejarah Sidoarjo dengan tema luar angkasa.',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', caption: 'Gameplay - Tembak asteroid sambil jawab quiz' },
            { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', caption: 'Level Selection - Pilih era sejarah' },
            { url: 'https://images.unsplash.com/photo-1493711662062-fa541f7f26a7?w=800&q=80', caption: 'Leaderboard - Kompetisi antar pemain' }
        ],
        story: {
            problem: 'Siswa menganggap pelajaran sejarah lokal membosankan. Kurangnya media pembelajaran yang menarik untuk generasi digital.',
            solution: 'Game arcade shooter yang mengintegrasikan quiz sejarah Sidoarjo. Setiap level mewakili era berbeda dalam sejarah kota.',
            impact: 'Game dimainkan oleh 500+ siswa. 90% pemain mengaku jadi lebih tertarik dengan sejarah lokal.'
        },
        timeline: [
            { date: 'Juli 2024', event: 'Concept Art', description: 'Desain karakter dan environment' },
            { date: 'Agustus 2024', event: 'Game Development', description: 'Programming gameplay mechanics' },
            { date: 'September 2024', event: 'Content Integration', description: 'Integrasi materi sejarah ke dalam game' },
            { date: 'Oktober 2024', event: 'Publishing', description: 'Release di Play Store' }
        ],
        team: [
            { name: 'Farhan Hakim', role: 'Game Designer', avatar: null },
            { name: 'Putri Ayu', role: '2D Artist', avatar: null },
            { name: 'Reza Mahendra', role: 'Programmer', avatar: null },
            { name: 'Nadia Safitri', role: 'Sound Designer', avatar: null }
        ],
        tech: ['Unity', 'C#', 'Photoshop'],
        author: 'Game Dev Club',
        stars: 200,
        collab_open: true,
        bg_gradient: 'from-amber-600 to-red-900',
        icon: 'gamepad-2',
        github_url: 'https://github.com/smartonesda/space-shooter',
        demo_url: 'https://play.google.com/store/apps/details?id=com.smartone.spaceshooter',
        login_credentials: []
    },
    {
        title: 'Smart Canteen',
        slug: 'smart-canteen',
        category: 'IoT',
        description: 'Sistem pembayaran kantin cashless menggunakan kartu RFID siswa.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80', caption: 'RFID Reader - Tap kartu untuk pembayaran' },
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', caption: 'Dashboard - Monitoring penjualan real-time' },
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', caption: 'Mobile App - Top up saldo via aplikasi' }
        ],
        story: {
            problem: 'Antrian panjang di kantin karena pembayaran tunai. Siswa sering kehilangan uang atau lupa membawa uang saku.',
            solution: 'Sistem pembayaran cashless menggunakan kartu RFID yang sudah dimiliki siswa untuk absensi. Orang tua bisa top up saldo via aplikasi.',
            impact: 'Waktu transaksi berkurang 70%. Tidak ada lagi kasus kehilangan uang. Orang tua bisa monitor pengeluaran anak.'
        },
        timeline: [
            { date: 'Agustus 2024', event: 'Hardware Setup', description: 'Perakitan dan programming Arduino + RFID reader' },
            { date: 'September 2024', event: 'Backend Development', description: 'API server dan database design' },
            { date: 'Oktober 2024', event: 'Frontend & Mobile', description: 'Dashboard admin dan aplikasi orang tua' },
            { date: 'November 2024', event: 'Pilot Testing', description: 'Uji coba di kantin sekolah' }
        ],
        team: [
            { name: 'Yoga Pratama', role: 'Hardware Engineer', avatar: null },
            { name: 'Sinta Dewi', role: 'Backend Developer', avatar: null },
            { name: 'Andi Wijaya', role: 'Frontend Developer', avatar: null },
            { name: 'Maya Sari', role: 'Mobile Developer', avatar: null }
        ],
        tech: ['Arduino', 'Node.js', 'React', 'MySQL'],
        author: 'IoT Division',
        stars: 156,
        collab_open: true,
        bg_gradient: 'from-orange-600 to-red-800',
        icon: 'cpu',
        github_url: 'https://github.com/smartonesda/smart-canteen',
        demo_url: null,
        login_credentials: []
    },
    {
        title: 'Portfolio Generator',
        slug: 'portfolio-generator',
        category: 'Web App',
        description: 'Platform untuk generate CV dan portfolio siswa otomatis.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', caption: 'Template Selection - Pilih desain portfolio' },
            { url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80', caption: 'Editor - Kustomisasi konten portfolio' },
            { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', caption: 'Preview - Lihat hasil portfolio' }
        ],
        story: {
            problem: 'Siswa SMK kesulitan membuat CV dan portfolio profesional untuk melamar kerja atau PKL. Tidak semua siswa menguasai desain grafis.',
            solution: 'Platform web yang memungkinkan siswa mengisi data dan otomatis generate CV serta portfolio dengan template profesional.',
            impact: '200+ siswa berhasil membuat portfolio. 30% peningkatan penerimaan PKL di perusahaan partner.'
        },
        timeline: [
            { date: 'September 2024', event: 'UI/UX Design', description: 'Desain template portfolio dan flow aplikasi' },
            { date: 'Oktober 2024', event: 'Development', description: 'Full-stack development dengan React dan Node.js' },
            { date: 'November 2024', event: 'Launch', description: 'Soft launch untuk siswa kelas XII' }
        ],
        team: [
            { name: 'Putra Wijaya', role: 'Full Stack Developer', avatar: null },
            { name: 'Laras Setiawati', role: 'UI/UX Designer', avatar: null }
        ],
        tech: ['React', 'Tailwind', 'Node.js', 'MongoDB'],
        author: 'Putra & Friends',
        stars: 92,
        collab_open: true,
        bg_gradient: 'from-red-500 to-amber-700',
        icon: 'layout',
        github_url: 'https://github.com/smartonesda/portfolio-generator',
        demo_url: 'https://portfolio.smartonedev.com',
        login_credentials: []
    },
    {
        title: 'Perpus Digital',
        slug: 'perpus-digital',
        category: 'Web App',
        description: 'Manajemen peminjaman buku perpustakaan online.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        screenshots: [
            { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', caption: 'Katalog Buku - Cari dan filter buku' },
            { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80', caption: 'Detail Buku - Informasi lengkap dan ketersediaan' },
            { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80', caption: 'Histori Peminjaman - Tracking buku yang dipinjam' }
        ],
        story: {
            problem: 'Sistem peminjaman buku perpustakaan masih manual dengan buku besar. Siswa tidak tahu buku apa saja yang tersedia tanpa datang ke perpustakaan.',
            solution: 'Sistem digital untuk katalog buku, peminjaman online, dan notifikasi jatuh tempo. Siswa bisa reservasi buku dari rumah.',
            impact: 'Kunjungan perpustakaan meningkat 40%. Tidak ada lagi buku hilang karena tracking digital.'
        },
        timeline: [
            { date: 'Agustus 2024', event: 'Requirements Gathering', description: 'Interview dengan petugas perpustakaan' },
            { date: 'September 2024', event: 'Development', description: 'Pembangunan sistem dengan PHP dan MySQL' },
            { date: 'Oktober 2024', event: 'Data Migration', description: 'Input data 2000+ buku ke sistem' }
        ],
        team: [
            { name: 'Bagas Aditya', role: 'Backend Developer', avatar: null },
            { name: 'Citra Permata', role: 'Frontend Developer', avatar: null },
            { name: 'Erik Saputra', role: 'Database Admin', avatar: null }
        ],
        tech: ['PHP Native', 'MySQL', 'Bootstrap'],
        author: 'Kelas X RPL 1',
        stars: 45,
        collab_open: false,
        bg_gradient: 'from-stone-700 to-red-900',
        icon: 'book-open',
        github_url: 'https://github.com/smartonesda/perpus-digital',
        demo_url: null,
        login_credentials: []
    }
]

async function seed() {
    const withSamples = process.argv.includes('--with-samples')
    console.log('=== SmartOneDev Firestore Seeder ===')

    // 1. Seed default admin user
    const adminUsername = process.env.ADMIN_USERNAME || 'smartonedev'
    const adminPassword = process.env.ADMIN_PASSWORD || 'smartonedev'

    const existingAdmin = await User.findByUsername(adminUsername)
    if (existingAdmin) {
        console.log(`✓ Admin user "${adminUsername}" sudah ada (skip)`)
    } else {
        await User.create({
            username: adminUsername,
            password: adminPassword,
            role: 'admin'
        })
        console.log(`+ Admin user "${adminUsername}" berhasil dibuat`)
    }

    // 2. Seed default categories
    for (const cat of DEFAULT_CATEGORIES) {
        const existing = await Category.findByName(cat.name)
        if (existing) {
            console.log(`✓ Kategori "${cat.name}" sudah ada (skip)`)
        } else {
            await Category.create(cat)
            console.log(`+ Kategori "${cat.name}" berhasil dibuat`)
        }
    }

    // 3. Seed sample projects (only when --with-samples flag is provided)
    if (withSamples) {
        const existingProjects = await Gallery.findAll()
        if (existingProjects.length > 0) {
            console.log(`✓ Collection gallery sudah berisi ${existingProjects.length} project (skip sample projects)`)
        } else {
            for (const project of SAMPLE_PROJECTS) {
                await Gallery.create(project)
                console.log(`+ Sample project "${project.title}" berhasil dibuat`)
            }
        }
    } else {
        console.log('ℹ Lewati sample projects (jalankan "npm run seed:samples" jika ingin mengisi data dummy)')
    }

    console.log('=== Seeding selesai! ===')
    process.exit(0)
}

seed().catch((error) => {
    console.error('Gagal melakukan seeding Firestore:', error.message)
    process.exit(1)
})

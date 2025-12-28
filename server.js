import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/authRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
// CORS Configuration - Allow Vercel domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'https://smartonedev.vercel.app',
    'https://smartonedev-be.vercel.app',
    process.env.FRONTEND_URL // Allow custom frontend URL from env
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true) // Allow all origins in production for now
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
        next()
    })
}

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/categories', categoryRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SmartOneDev API is running',
        timestamp: new Date().toISOString()
    })
})

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'SmartOneDev API',
        version: '1.0.0',
        description: 'Backend API for SmartOneDev Gallery Management System',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            gallery: '/api/gallery'
        }
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║           SmartOneDev API Server                  ║
╠═══════════════════════════════════════════════════╣
║   Status: Running                                 ║
║   Port: ${PORT}                                      ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(20)}        ║
║                                                   ║
║   Endpoints:                                      ║
║   - GET  /api/health                              ║
║   - POST /api/auth/login                          ║
║   - GET  /api/gallery                             ║
║   - POST /api/gallery (admin)                     ║
║   - PUT  /api/gallery/:id (admin)                 ║
║   - DELETE /api/gallery/:id (admin)               ║
╚═══════════════════════════════════════════════════╝
  `)
})

export default app

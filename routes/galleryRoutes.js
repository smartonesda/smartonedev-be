import express from 'express'
import multer from 'multer'
import galleryController from '../controllers/galleryController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

// Configure multer for memory storage (for Cloudinary upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WEBP)'))
        }
    }
})

// Public routes
router.get('/', galleryController.getAll)
router.get('/slug/:slug', galleryController.getBySlug)
router.get('/:id', galleryController.getById)

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, galleryController.create)
router.put('/:id', authMiddleware, adminMiddleware, galleryController.update)
router.delete('/:id', authMiddleware, adminMiddleware, galleryController.delete)

// Image upload route (protected)
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), galleryController.uploadImage)

// Image delete route (protected)
router.delete('/image/:filename', authMiddleware, adminMiddleware, galleryController.deleteImage)

export default router


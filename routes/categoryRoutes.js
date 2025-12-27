import express from 'express'
import categoryController from '../controllers/categoryController.js'
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, categoryController.create)
router.put('/:id', authMiddleware, adminMiddleware, categoryController.update)
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.delete)

export default router

import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt.js'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token diperlukan'
            })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, jwtConfig.secret)
        req.user = decoded

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token sudah kedaluwarsa'
            })
        }

        return res.status(401).json({
            success: false,
            message: 'Token tidak valid'
        })
    }
}

export const adminMiddleware = (req, res, next) => {
    // Check if user is admin (for now, any authenticated user is considered admin)
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak'
        })
    }
    next()
}

export default authMiddleware


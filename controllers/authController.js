import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { jwtConfig } from '../config/jwt.js'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

// Default admin credentials from env
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'smartonedev'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'smartonedev'

export const authController = {
    async login(req, res) {
        try {
            const { username, password } = req.body

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username dan password diperlukan'
                })
            }

            // Try to find user in database
            let user = null
            try {
                user = await User.findByUsername(username)
            } catch (dbError) {
                console.log('Database not available, using fallback auth')
            }

            // If user found in database, validate password
            if (user) {
                const isValid = await User.validatePassword(password, user.password_hash)

                if (!isValid) {
                    return res.status(401).json({
                        success: false,
                        message: 'Username atau password salah'
                    })
                }

                // Check if user is admin
                if (user.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: 'Akses ditolak. Hanya admin yang diizinkan.'
                    })
                }

                // Generate token
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    },
                    jwtConfig.secret,
                    { expiresIn: jwtConfig.expiresIn }
                )

                return res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                })
            }

            // Fallback: Check against env credentials (for when DB is not set up)
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                const token = jwt.sign(
                    {
                        id: 'admin-fallback',
                        username: ADMIN_USERNAME,
                        role: 'admin'
                    },
                    jwtConfig.secret,
                    { expiresIn: jwtConfig.expiresIn }
                )

                return res.json({
                    success: true,
                    token,
                    user: {
                        id: 'admin-fallback',
                        username: ADMIN_USERNAME,
                        role: 'admin'
                    }
                })
            }

            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            })
        } catch (error) {
            console.error('Login error:', error)
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            })
        }
    },

    async me(req, res) {
        try {
            return res.json({
                success: true,
                user: req.user
            })
        } catch (error) {
            console.error('Get user error:', error)
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            })
        }
    }
}

export default authController

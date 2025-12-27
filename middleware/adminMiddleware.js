export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Autentikasi diperlukan'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang diizinkan.'
        })
    }

    next()
}

export default adminMiddleware

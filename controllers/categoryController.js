import Category from '../models/Category.js'

export const categoryController = {
    // GET /api/categories
    async getAll(req, res) {
        try {
            const categories = await Category.findAll()
            return res.json({
                success: true,
                data: categories
            })
        } catch (error) {
            console.error('Get categories error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data kategori'
            })
        }
    },

    // GET /api/categories/:id
    async getById(req, res) {
        try {
            const { id } = req.params
            const category = await Category.findById(id)

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                })
            }

            return res.json({
                success: true,
                data: category
            })
        } catch (error) {
            console.error('Get category error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data kategori'
            })
        }
    },

    // POST /api/categories (protected)
    async create(req, res) {
        try {
            const { name, color, icon } = req.body

            if (!name?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama kategori wajib diisi'
                })
            }

            // Check if already exists
            const existing = await Category.findByName(name.trim())
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Kategori dengan nama tersebut sudah ada'
                })
            }

            const category = await Category.create({ name: name.trim(), color, icon })

            return res.status(201).json({
                success: true,
                data: category,
                message: 'Kategori berhasil dibuat'
            })
        } catch (error) {
            console.error('Create category error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal membuat kategori: ' + error.message
            })
        }
    },

    // PUT /api/categories/:id (protected)
    async update(req, res) {
        try {
            const { id } = req.params
            const { name, color, icon } = req.body

            const category = await Category.update(id, { name, color, icon })

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                })
            }

            return res.json({
                success: true,
                data: category,
                message: 'Kategori berhasil diupdate'
            })
        } catch (error) {
            console.error('Update category error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengupdate kategori: ' + error.message
            })
        }
    },

    // DELETE /api/categories/:id (protected)
    async delete(req, res) {
        try {
            const { id } = req.params

            // Get category first to check name
            const category = await Category.findById(id)
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Kategori tidak ditemukan'
                })
            }

            // Check if category is in use
            const inUse = await Category.isInUse(category.name)
            if (inUse) {
                return res.status(400).json({
                    success: false,
                    message: 'Kategori tidak bisa dihapus karena sedang digunakan oleh project'
                })
            }

            await Category.delete(id)

            return res.json({
                success: true,
                message: 'Kategori berhasil dihapus'
            })
        } catch (error) {
            console.error('Delete category error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus kategori: ' + error.message
            })
        }
    }
}

export default categoryController

import Gallery from '../models/Gallery.js'

export const galleryController = {
    // GET /api/gallery
    async getAll(req, res) {
        try {
            const projects = await Gallery.findAll()
            return res.json({
                success: true,
                data: projects || []
            })
        } catch (error) {
            console.error('Gallery fetch error:', error.message)
            return res.json({
                success: true,
                data: [],
                message: 'Tidak dapat mengambil data dari database'
            })
        }
    },

    // GET /api/gallery/:id
    async getById(req, res) {
        try {
            const { id } = req.params
            const project = await Gallery.findById(id)

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project tidak ditemukan'
                })
            }

            return res.json({
                success: true,
                data: project
            })
        } catch (error) {
            console.error('Get project error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data project'
            })
        }
    },

    // GET /api/gallery/slug/:slug
    async getBySlug(req, res) {
        try {
            const { slug } = req.params
            const project = await Gallery.findBySlug(slug)

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project tidak ditemukan'
                })
            }

            return res.json({
                success: true,
                data: project
            })
        } catch (error) {
            console.error('Get project by slug error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data project'
            })
        }
    },

    // POST /api/gallery (protected)
    async create(req, res) {
        try {
            const projectData = req.body

            // Generate slug from title
            if (!projectData.slug && projectData.title) {
                projectData.slug = projectData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
            }

            const project = await Gallery.create(projectData)

            return res.status(201).json({
                success: true,
                data: project,
                message: 'Project berhasil dibuat'
            })
        } catch (error) {
            console.error('Create project error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal membuat project: ' + error.message
            })
        }
    },

    // PUT /api/gallery/:id (protected)
    async update(req, res) {
        try {
            const { id } = req.params
            const projectData = req.body

            // Update slug if title changed
            if (projectData.title && !projectData.slug) {
                projectData.slug = projectData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
            }

            const project = await Gallery.update(id, projectData)

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project tidak ditemukan'
                })
            }

            return res.json({
                success: true,
                data: project,
                message: 'Project berhasil diupdate'
            })
        } catch (error) {
            console.error('Update project error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengupdate project: ' + error.message
            })
        }
    },

    // DELETE /api/gallery/:id (protected)
    async delete(req, res) {
        try {
            const { id } = req.params

            await Gallery.delete(id)

            return res.json({
                success: true,
                message: 'Project berhasil dihapus'
            })
        } catch (error) {
            console.error('Delete project error:', error.message)
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus project: ' + error.message
            })
        }
    },

    // POST /api/gallery/upload (protected)
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'File gambar diperlukan'
                })
            }

            const file = req.file
            const timestamp = Date.now()
            const ext = file.originalname.split('.').pop()
            const filename = `${timestamp}.${ext}`

            // Upload to Cloudinary with contentType
            const publicUrl = await Gallery.uploadImage(file.buffer, filename, file.mimetype)

            return res.json({
                success: true,
                data: {
                    url: publicUrl,
                    filename: filename
                },
                message: 'Image berhasil diupload'
            })
        } catch (error) {
            console.error('Upload error:', error)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengupload image: ' + error.message
            })
        }
    },

    // DELETE /api/gallery/image/:filename (protected)
    async deleteImage(req, res) {
        try {
            const { filename } = req.params

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    message: 'Filename diperlukan'
                })
            }

            await Gallery.deleteImage(filename)

            return res.json({
                success: true,
                message: 'Image berhasil dihapus dari storage'
            })
        } catch (error) {
            console.error('Delete image error:', error)
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus image: ' + error.message
            })
        }
    }
}

export default galleryController


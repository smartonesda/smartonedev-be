import { getDb, normalizeTimestamp } from '../config/firebase.js'
import { uploadImageBuffer, deleteImageByFilename } from '../config/cloudinary.js'

const COLLECTION = 'gallery'

function generateSlug(title) {
    return String(title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function serializeProject(doc) {
    if (!doc || !doc.exists) return null
    const data = doc.data()

    return {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        category: data.category || 'Web App',
        description: data.description || '',
        image: data.image || null,
        screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
        story: data.story && typeof data.story === 'object' ? data.story : {},
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
        team: Array.isArray(data.team) ? data.team : [],
        tech: Array.isArray(data.tech) ? data.tech : [],
        author: data.author || '',
        stars: typeof data.stars === 'number' ? data.stars : Number(data.stars) || 0,
        collab_open: Boolean(data.collab_open),
        bg_gradient: data.bg_gradient || 'from-red-600 to-red-900',
        icon: data.icon || 'globe',
        github_url: data.github_url || null,
        demo_url: data.demo_url || null,
        login_credentials: Array.isArray(data.login_credentials) ? data.login_credentials : [],
        created_at: normalizeTimestamp(data.created_at),
        updated_at: normalizeTimestamp(data.updated_at)
    }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
    const db = getDb()
    let candidate = baseSlug || `project-${Date.now().toString(36)}`

    const snapshot = await db
        .collection(COLLECTION)
        .where('slug', '==', candidate)
        .limit(1)
        .get()

    if (!snapshot.empty && snapshot.docs[0].id !== excludeId) {
        candidate = `${candidate}-${Date.now().toString(36)}`
    }

    return candidate
}

export const Gallery = {
    async findAll() {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .orderBy('created_at', 'desc')
            .get()

        return snapshot.docs.map(serializeProject)
    },

    async findById(id) {
        const db = getDb()
        const doc = await db.collection(COLLECTION).doc(String(id)).get()
        return serializeProject(doc)
    },

    async findBySlug(slug) {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .where('slug', '==', slug)
            .limit(1)
            .get()

        if (snapshot.empty) return null
        return serializeProject(snapshot.docs[0])
    },

    async create(projectData) {
        const db = getDb()
        const now = new Date().toISOString()
        const baseSlug = projectData.slug || generateSlug(projectData.title)
        const uniqueSlug = await ensureUniqueSlug(baseSlug)

        const newProject = {
            title: projectData.title,
            slug: uniqueSlug,
            category: projectData.category || 'Web App',
            description: projectData.description || '',
            image: projectData.image || null,
            screenshots: Array.isArray(projectData.screenshots) ? projectData.screenshots : [],
            story: projectData.story && typeof projectData.story === 'object' ? projectData.story : {},
            timeline: Array.isArray(projectData.timeline) ? projectData.timeline : [],
            team: Array.isArray(projectData.team) ? projectData.team : [],
            tech: Array.isArray(projectData.tech) ? projectData.tech : [],
            author: projectData.author || '',
            stars: Number(projectData.stars) || 0,
            collab_open: Boolean(projectData.collab_open),
            bg_gradient: projectData.bg_gradient || 'from-red-600 to-red-900',
            icon: projectData.icon || 'globe',
            github_url: projectData.github_url || null,
            demo_url: projectData.demo_url || null,
            login_credentials: Array.isArray(projectData.login_credentials) ? projectData.login_credentials : [],
            created_at: now,
            updated_at: now
        }

        const docRef = await db.collection(COLLECTION).add(newProject)

        return {
            id: docRef.id,
            ...newProject
        }
    },

    async update(id, projectData) {
        const db = getDb()
        const docRef = db.collection(COLLECTION).doc(String(id))
        const existingDoc = await docRef.get()

        if (!existingDoc.exists) {
            return null
        }

        const updateData = {
            updated_at: new Date().toISOString()
        }

        // Only include whitelisted fields that are provided
        if (projectData.title !== undefined) updateData.title = projectData.title
        if (projectData.slug !== undefined) {
            updateData.slug = await ensureUniqueSlug(projectData.slug, String(id))
        }
        if (projectData.category !== undefined) updateData.category = projectData.category
        if (projectData.description !== undefined) updateData.description = projectData.description
        if (projectData.image !== undefined) updateData.image = projectData.image || null
        if (projectData.screenshots !== undefined) updateData.screenshots = projectData.screenshots
        if (projectData.story !== undefined) updateData.story = projectData.story
        if (projectData.timeline !== undefined) updateData.timeline = projectData.timeline
        if (projectData.team !== undefined) updateData.team = projectData.team
        if (projectData.tech !== undefined) updateData.tech = projectData.tech
        if (projectData.author !== undefined) updateData.author = projectData.author
        if (projectData.stars !== undefined) updateData.stars = Number(projectData.stars) || 0
        if (projectData.collab_open !== undefined) updateData.collab_open = Boolean(projectData.collab_open)
        if (projectData.bg_gradient !== undefined) updateData.bg_gradient = projectData.bg_gradient
        if (projectData.icon !== undefined) updateData.icon = projectData.icon
        if (projectData.github_url !== undefined) updateData.github_url = projectData.github_url || null
        if (projectData.demo_url !== undefined) updateData.demo_url = projectData.demo_url || null
        if (projectData.login_credentials !== undefined) updateData.login_credentials = projectData.login_credentials

        await docRef.update(updateData)

        const updatedDoc = await docRef.get()
        return serializeProject(updatedDoc)
    },

    async delete(id) {
        const db = getDb()
        await db.collection(COLLECTION).doc(String(id)).delete()
        return true
    },

    // Upload image to Cloudinary
    async uploadImage(file, filename, contentType = 'image/jpeg') {
        return await uploadImageBuffer(file, filename, contentType)
    },

    // Delete image from Cloudinary
    async deleteImage(filename) {
        return await deleteImageByFilename(filename)
    }
}

export default Gallery

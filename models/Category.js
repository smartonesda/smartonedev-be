import { getDb, normalizeTimestamp } from '../config/firebase.js'

const COLLECTION = 'categories'
const GALLERY_COLLECTION = 'gallery'

function generateSlug(name) {
    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function serializeCategory(doc) {
    if (!doc || !doc.exists) return null
    const data = doc.data()
    return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        color: data.color || '#dc2626',
        icon: data.icon || 'folder',
        created_at: normalizeTimestamp(data.created_at)
    }
}

const Category = {
    // Get all categories
    async findAll() {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .orderBy('name', 'asc')
            .get()

        return snapshot.docs.map(serializeCategory)
    },

    // Get category by ID
    async findById(id) {
        const db = getDb()
        const doc = await db.collection(COLLECTION).doc(String(id)).get()
        return serializeCategory(doc)
    },

    // Get category by name
    async findByName(name) {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .where('name', '==', name)
            .limit(1)
            .get()

        if (snapshot.empty) return null
        return serializeCategory(snapshot.docs[0])
    },

    // Get category by slug
    async findBySlug(slug) {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .where('slug', '==', slug)
            .limit(1)
            .get()

        if (snapshot.empty) return null
        return serializeCategory(snapshot.docs[0])
    },

    // Create new category
    async create(categoryData) {
        const db = getDb()
        const name = categoryData.name.trim()
        const slug = generateSlug(name)

        const existingBySlug = await this.findBySlug(slug)
        if (existingBySlug) {
            throw new Error('Kategori dengan slug serupa sudah ada')
        }

        const now = new Date().toISOString()
        const docData = {
            name,
            slug,
            color: categoryData.color || '#dc2626',
            icon: categoryData.icon || 'folder',
            created_at: now
        }

        const docRef = await db.collection(COLLECTION).add(docData)

        return {
            id: docRef.id,
            ...docData
        }
    },

    // Update category
    async update(id, categoryData) {
        const db = getDb()
        const docRef = db.collection(COLLECTION).doc(String(id))
        const existingDoc = await docRef.get()

        if (!existingDoc.exists) {
            return null
        }

        const updateData = {}
        if (categoryData.name) {
            const trimmedName = categoryData.name.trim()
            const newSlug = generateSlug(trimmedName)

            const duplicateName = await this.findByName(trimmedName)
            if (duplicateName && duplicateName.id !== String(id)) {
                throw new Error('Kategori dengan nama tersebut sudah ada')
            }

            const duplicateSlug = await this.findBySlug(newSlug)
            if (duplicateSlug && duplicateSlug.id !== String(id)) {
                throw new Error('Kategori dengan slug serupa sudah ada')
            }

            updateData.name = trimmedName
            updateData.slug = newSlug
        }
        if (categoryData.color) updateData.color = categoryData.color
        if (categoryData.icon) updateData.icon = categoryData.icon

        if (Object.keys(updateData).length > 0) {
            await docRef.update(updateData)
        }

        const updatedDoc = await docRef.get()
        return serializeCategory(updatedDoc)
    },

    // Check if category is in use by any project
    async isInUse(categoryName) {
        const db = getDb()
        const snapshot = await db
            .collection(GALLERY_COLLECTION)
            .where('category', '==', categoryName)
            .limit(1)
            .get()

        return !snapshot.empty
    },

    // Delete category (only if not in use)
    async delete(id) {
        const db = getDb()
        await db.collection(COLLECTION).doc(String(id)).delete()
        return true
    }
}

export default Category

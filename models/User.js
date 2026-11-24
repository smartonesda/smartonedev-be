import { getDb, normalizeTimestamp } from '../config/firebase.js'
import bcrypt from 'bcryptjs'

const COLLECTION = 'users'

function serializeUser(doc, includePassword = false) {
    if (!doc || !doc.exists) return null
    const data = doc.data()
    const base = {
        id: doc.id,
        username: data.username,
        role: data.role || 'admin',
        created_at: normalizeTimestamp(data.created_at)
    }

    if (includePassword) {
        base.password_hash = data.password_hash
    }

    return base
}

export const User = {
    async findByUsername(username) {
        const db = getDb()
        const snapshot = await db
            .collection(COLLECTION)
            .where('username', '==', username)
            .limit(1)
            .get()

        if (snapshot.empty) return null
        return serializeUser(snapshot.docs[0], true)
    },

    async findById(id) {
        const db = getDb()
        const doc = await db.collection(COLLECTION).doc(String(id)).get()
        return serializeUser(doc, false)
    },

    async create(userData) {
        const db = getDb()
        const existing = await this.findByUsername(userData.username)
        if (existing) {
            throw new Error(`Username "${userData.username}" sudah digunakan`)
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(userData.password, salt)
        const now = new Date().toISOString()

        const newUser = {
            username: userData.username,
            password_hash: passwordHash,
            role: userData.role || 'admin',
            created_at: now
        }

        const docRef = await db.collection(COLLECTION).add(newUser)

        return {
            id: docRef.id,
            ...newUser
        }
    },

    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }
}

export default User

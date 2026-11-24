import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { getDb, normalizeTimestamp } from '../config/firebase.js'

dotenv.config()

const COLLECTIONS = ['users', 'categories', 'gallery']

function normalizeDocumentData(data) {
    const normalized = { ...data }
    if (normalized.created_at) {
        normalized.created_at = normalizeTimestamp(normalized.created_at)
    }
    if (normalized.updated_at) {
        normalized.updated_at = normalizeTimestamp(normalized.updated_at)
    }
    return normalized
}

async function backup() {
    console.log('=== SmartOneDev Firestore Backup ===')
    const db = getDb()

    const payload = {
        metadata: {
            exported_at: new Date().toISOString(),
            project_id: process.env.FIREBASE_PROJECT_ID || 'smartonedev-sda',
            collections: {}
        },
        data: {}
    }

    for (const colName of COLLECTIONS) {
        const snapshot = await db.collection(colName).get()
        const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...normalizeDocumentData(doc.data())
        }))
        payload.data[colName] = docs
        payload.metadata.collections[colName] = docs.length
        console.log(`✓ Collection "${colName}": ${docs.length} dokumen`)
    }

    const backupsDir = path.resolve(process.cwd(), 'backups')
    fs.mkdirSync(backupsDir, { recursive: true })

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `firestore-backup-${stamp}.json`
    const filePath = path.join(backupsDir, filename)

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8')
    console.log(`\nBackup berhasil disimpan ke:\n${filePath}`)
    process.exit(0)
}

backup().catch((error) => {
    console.error('Gagal membuat backup Firestore:', error.message)
    process.exit(1)
})

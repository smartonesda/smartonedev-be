import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { getDb } from '../config/firebase.js'

dotenv.config()

async function restore() {
    const inputPath = process.argv[2]
    if (!inputPath) {
        console.error('Usage: npm run restore -- backups/firestore-backup-xxxx.json')
        process.exit(1)
    }

    const resolvedPath = path.resolve(process.cwd(), inputPath)
    if (!fs.existsSync(resolvedPath)) {
        console.error(`File backup tidak ditemukan: ${resolvedPath}`)
        process.exit(1)
    }

    const backupFile = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
    const collections = backupFile.data || {}
    const db = getDb()

    console.log(`=== Restore Firestore dari ${path.basename(resolvedPath)} ===`)

    for (const [colName, docs] of Object.entries(collections)) {
        if (!Array.isArray(docs) || docs.length === 0) {
            console.log(`- Collection "${colName}": 0 dokumen (skip)`)
            continue
        }

        // Firestore batch limit is 500 writes per batch
        const chunkSize = 400
        for (let i = 0; i < docs.length; i += chunkSize) {
            const chunk = docs.slice(i, i + chunkSize)
            const batch = db.batch()
            for (const item of chunk) {
                const { id, ...docData } = item
                const docRef = id
                    ? db.collection(colName).doc(String(id))
                    : db.collection(colName).doc()
                batch.set(docRef, docData, { merge: true })
            }
            await batch.commit()
        }

        console.log(`✓ Collection "${colName}": ${docs.length} dokumen berhasil di-restore`)
    }

    console.log('=== Restore selesai! ===')
    process.exit(0)
}

restore().catch((error) => {
    console.error('Gagal melakukan restore Firestore:', error.message)
    process.exit(1)
})

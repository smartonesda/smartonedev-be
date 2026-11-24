import { initializeApp, cert, applicationDefault, getApps, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

let firestoreInstance = null

function parseServiceAccountFromEnv() {
    // Option 1: Single JSON or Base64-encoded JSON env var (recommended for Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim()
        const jsonString = raw.startsWith('{')
            ? raw
            : Buffer.from(raw, 'base64').toString('utf8')
        const parsed = JSON.parse(jsonString)
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, '\n')
        }
        return parsed
    }

    // Option 2: Individual env vars (recommended for .env and Vercel)
    if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
    ) {
        const cleanedKey = process.env.FIREBASE_PRIVATE_KEY
            .trim()
            .replace(/^["']|["']$/g, '')
            .replace(/\\n/g, '\n')

        return {
            projectId: process.env.FIREBASE_PROJECT_ID.trim(),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
            privateKey: cleanedKey
        }
    }

    // Option 3: Local service account JSON file path (convenient for local dev)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const resolvedPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Firebase service account file not found at: ${resolvedPath}`)
        }
        return JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
    }

    // Option 3b: Auto-detect ./serviceAccountKey.json when present locally
    const defaultKeyPath = path.resolve(process.cwd(), 'serviceAccountKey.json')
    if (fs.existsSync(defaultKeyPath)) {
        return JSON.parse(fs.readFileSync(defaultKeyPath, 'utf8'))
    }

    return null
}

function initFirebaseApp() {
    if (getApps().length > 0) {
        return getApp()
    }

    const serviceAccount = parseServiceAccountFromEnv()
    const projectId =
        serviceAccount?.projectId ||
        serviceAccount?.project_id ||
        process.env.FIREBASE_PROJECT_ID

    if (serviceAccount) {
        return initializeApp({
            credential: cert(serviceAccount),
            ...(projectId ? { projectId } : {})
        })
    }

    // Option 4: Google Application Default Credentials or Firestore Emulator
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIRESTORE_EMULATOR_HOST) {
        return initializeApp({
            credential: applicationDefault(),
            ...(projectId ? { projectId } : {})
        })
    }

    throw new Error(
        'Firebase Admin credentials tidak ditemukan. Isi FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY (atau FIREBASE_SERVICE_ACCOUNT_PATH / FIREBASE_SERVICE_ACCOUNT_JSON) di file .env.'
    )
}

export function isFirebaseConfigured() {
    const hasDefaultLocalKey = fs.existsSync(
        path.resolve(process.cwd(), 'serviceAccountKey.json')
    )

    return Boolean(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
        (process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_CLIENT_EMAIL &&
            process.env.FIREBASE_PRIVATE_KEY) ||
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
        hasDefaultLocalKey ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.FIRESTORE_EMULATOR_HOST
    )
}

export function getDb() {
    if (firestoreInstance) {
        return firestoreInstance
    }

    const app = initFirebaseApp()
    const databaseId = process.env.FIRESTORE_DATABASE_ID

    const db = databaseId && databaseId !== '(default)'
        ? getFirestore(app, databaseId)
        : getFirestore(app)

    db.settings({ ignoreUndefinedProperties: true })
    firestoreInstance = db
    return firestoreInstance
}

/**
 * Normalize Firestore Timestamp / Date / ISO string into an ISO-8601 string
 * so frontend date formatting & sorting work identically to PostgreSQL TIMESTAMPTZ.
 */
export function normalizeTimestamp(value) {
    if (!value) return null
    if (typeof value === 'string') return value
    if (typeof value?.toDate === 'function') return value.toDate().toISOString()
    if (value instanceof Date) return value.toISOString()
    if (typeof value?._seconds === 'number') {
        return new Date(value._seconds * 1000).toISOString()
    }
    return String(value)
}

export default getDb

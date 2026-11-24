import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'smartonedev/gallery'

let configured = false

export function isCloudinaryConfigured() {
    return Boolean(
        process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET)
    )
}

function ensureCloudinaryConfigured() {
    if (configured) return

    if (!isCloudinaryConfigured()) {
        throw new Error(
            'Cloudinary credentials tidak ditemukan. Isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di file .env.'
        )
    }

    if (process.env.CLOUDINARY_URL) {
        cloudinary.config({ secure: true })
    } else {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
            api_key: process.env.CLOUDINARY_API_KEY.trim(),
            api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
            secure: true
        })
    }

    configured = true
}

/**
 * Upload image buffer to Cloudinary and return public HTTPS URL.
 */
export async function uploadImageBuffer(buffer, filename) {
    ensureCloudinaryConfigured()

    const cleanBaseName = String(filename)
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: CLOUDINARY_FOLDER,
                public_id: cleanBaseName,
                resource_type: 'image',
                overwrite: true,
                unique_filename: false
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result.secure_url)
            }
        )

        uploadStream.end(buffer)
    })
}

/**
 * Delete image from Cloudinary by filename (e.g. "1732425600123.jpg") or full public_id.
 */
export async function deleteImageByFilename(filename) {
    ensureCloudinaryConfigured()

    const decoded = decodeURIComponent(String(filename).split('?')[0])
    const withoutExt = decoded.replace(/\.[^/.]+$/, '')
    const publicId = withoutExt.startsWith(`${CLOUDINARY_FOLDER}/`)
        ? withoutExt
        : `${CLOUDINARY_FOLDER}/${withoutExt}`

    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true
    })

    if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Cloudinary delete failed: ${result.result}`)
    }

    return true
}

export { cloudinary, CLOUDINARY_FOLDER }
export default cloudinary

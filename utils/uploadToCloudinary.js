const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

/**
 * Upload un fichier vers Cloudinary avec un public_id fixe.
 * Si une image existe déjà à cet emplacement, elle est automatiquement remplacée.
 */
function uploadToCloudinary(fileBuffer, folder, publicId) {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                overwrite: true,
                invalidate: true // force le rafraîchissement du cache CDN sur l'ancienne image
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )

        streamifier.createReadStream(fileBuffer).pipe(uploadStream)

    })

}

/**
 * Supprime TOUTES les images d'un dossier Cloudinary (ex: tout le dossier d'un utilisateur).
 */
async function deleteFolderFromCloudinary(folder) {

    await cloudinary.api.delete_resources_by_prefix(folder)
    await cloudinary.api.delete_folder(folder).catch(() => {
        // le dossier peut déjà être vide/supprimé, on ignore l'erreur dans ce cas
    })

}

module.exports = { uploadToCloudinary, deleteFolderFromCloudinary }
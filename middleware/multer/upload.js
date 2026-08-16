const multer = require("multer")

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 Mo max par fichier
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Format d'image non supporté (jpeg, png, webp uniquement)"))
        }
        cb(null, true)
    }
})

// Champs attendus pour le profil livreur — adapte les noms selon ce que ton app mobile enverra
const courierPhotosUpload = upload.fields([
    { name: "documentPhoto", maxCount: 1 },
    { name: "selfiePhoto", maxCount: 1 },
    { name: "vehiculePhoto", maxCount: 1 },
    { name: "vehiculePlatePhoto", maxCount: 1 },
    { name: "drivingLicensePhoto", maxCount: 1 }
])

module.exports = { upload, courierPhotosUpload }
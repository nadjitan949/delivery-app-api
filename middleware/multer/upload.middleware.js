const { uploadToCloudinary } = require("../../utils/uploadToCloudinary")
const responses = require("../../messages/responses")

const FIELD_MAP = {
    documentPhoto: "documentPhotoUrl",
    selfiePhoto: "selfiePhotoUrl",
    vehiculePhoto: "vehiculePhotoUrl",
    vehiculePlatePhoto: "vehiculePlatePhotoUrl",
    drivingLicensePhoto: "drivingLicensePhotoUrl"
}

async function uploadCourierPhotos(req, res, next) {

    try {

        if (!req.files) {
            return next()
        }

        // userId doit être présent dans le body (route complete-profile) — voir note plus bas pour update-profile
        const userId = req.body.userId

        if (!userId) {
            return res.status(responses.BAD_REQUEST).json({
                success: false,
                message: "L'identifiant utilisateur est requis pour l'envoi des images"
            })
        }

        for (const fileField of Object.keys(FIELD_MAP)) {

            const file = req.files[fileField]?.[0]
            if (!file) continue

            const result = await uploadToCloudinary(
                file.buffer,
                `couriers/${userId}`,
                fileField // ex: "selfiePhoto" → toujours le même emplacement, donc remplacement auto
            )

            req.body[FIELD_MAP[fileField]] = result.secure_url

        }

        next()

    } catch (error) {
        console.log(`Erreur upload photos livreur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Erreur lors de l'envoi des images",
            error: error.message
        })
    }

}

module.exports = uploadCourierPhotos
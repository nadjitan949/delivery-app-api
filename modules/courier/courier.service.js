const CourierProfile = require("../../database/models/tables/couriers.model")
const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")

async function completeCourierProfileService(req, res) {

    try {

        const { documentNumber, userId, vehiculeType, vehiculePlateNumber, drivingLicenseNumber } = req.body
        const user = await User.findByPk(userId, {
            include: {
                model: CourierProfile
            }
        })

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable",
                data: user
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (user.role !== "courier") {
            response = {
                success: false,
                message: "Cet utilisateur ne peux pas être un livreur, veuillez changez de status"
            }
            return res.status(responses.UNAUTHORIZED).json(response)
        }

        if (user.CourierProfile) {
            response = {
                success: false,
                message: "Cet utilisateur est déjà livreur",
                data: user
            }
            return res.status(responses.CONFLICT).json(response)
        }

        // vehiculePlateNumber obligatoire sauf si vélo
        if (vehiculeType !== "bicycle" && !vehiculePlateNumber) {
            response = {
                success: false,
                message: "La plaque d'immatriculation est obligatoire pour ce type de véhicule"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        // drivingLicenseNumber obligatoire seulement si voiture
        if (vehiculeType === "car" && !drivingLicenseNumber) {
            response = {
                success: false,
                message: "Le numéro de permis de conduire est obligatoire pour une voiture"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        const existdocumentNumber = await CourierProfile.findOne({ where: { documentNumber }, paranoid: false })
        if (existdocumentNumber) {
            response = {
                success: false,
                message: "Ce numero d'identité appartient déjà à un autre utilisateur"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const existPlateNumber = vehiculePlateNumber && await CourierProfile.findOne({ where: { vehiculePlateNumber }, paranoid: false })
        if (existPlateNumber) {
            response = {
                success: false,
                message: "Cette plaque d'immatriculation est déjà associée à un autre véhicule"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const existLicenseNumber = drivingLicenseNumber && await CourierProfile.findOne({ where: { drivingLicenseNumber }, paranoid: false })
        if (existLicenseNumber) {
            response = {
                success: false,
                message: "Ce numéro de permis est déjà associé à un autre utilisateur"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const newCourier = await CourierProfile.create({ ...req.body, userId })
        response = {
            success: true,
            message: "Informations sauvegardé avec succès, votre demade est en attente d'examination",
            data: newCourier
        }
        return res.status(responses.CREATED).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function updateCourierProfileService(req, res) {

    try {

        const id = req.params.id
        const { documentNumber, vehiculeType, vehiculePlateNumber, drivingLicenseNumber } = req.body

        const courierProfile = await CourierProfile.findByPk(id)

        let response = {}
        if (!courierProfile) {
            response = {
                success: false,
                message: "Profil livreur introuvable",
                data: courierProfile
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        const vehiculeTypeChanged = vehiculeType && vehiculeType !== courierProfile.vehiculeType

        // le type de véhicule final (nouveau si fourni, sinon celui déjà enregistré)
        const finalvehiculeType = vehiculeType || courierProfile.vehiculeType
        const finalPlateNumber = vehiculePlateNumber !== undefined ? vehiculePlateNumber : courierProfile.vehiculePlateNumber
        const finalLicenseNumber = drivingLicenseNumber !== undefined ? drivingLicenseNumber : courierProfile.drivingLicenseNumber

        if (finalvehiculeType !== "bicycle" && !finalPlateNumber) {
            response = {
                success: false,
                message: "La plaque d'immatriculation est obligatoire pour ce type de véhicule"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (finalvehiculeType === "car" && !finalLicenseNumber) {
            response = {
                success: false,
                message: "Le numéro de permis de conduire est obligatoire pour une voiture"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        const existdocumentNumber = documentNumber && documentNumber !== courierProfile.documentNumber
            && await CourierProfile.findOne({ where: { documentNumber } })
        if (existdocumentNumber) {
            response = {
                success: false,
                message: "Ce numero d'identité appartient déjà à un autre utilisateur"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const existPlateNumber = vehiculePlateNumber && vehiculePlateNumber !== courierProfile.vehiculePlateNumber
            && await CourierProfile.findOne({ where: { vehiculePlateNumber } })
        if (existPlateNumber) {
            response = {
                success: false,
                message: "Cette plaque d'immatriculation est déjà associée à un autre véhicule"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const existLicenseNumber = drivingLicenseNumber && drivingLicenseNumber !== courierProfile.drivingLicenseNumber
            && await CourierProfile.findOne({ where: { drivingLicenseNumber } })
        if (existLicenseNumber) {
            response = {
                success: false,
                message: "Ce numéro de permis est déjà associé à un autre utilisateur"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const updateData = { ...req.body }

        // Si le véhicule change, on nettoie les champs devenus obsolètes
        // et on remet le profil en attente de vérification
        if (vehiculeTypeChanged) {

            if (finalvehiculeType === "bicycle") {
                updateData.vehiculePlateNumber = null
                updateData.vehiculePlatePhotoUrl = null
                updateData.drivingLicenseNumber = null
                updateData.drivingLicensePhotoUrl = null
            }

            if (finalvehiculeType !== "car") {
                updateData.drivingLicenseNumber = updateData.drivingLicenseNumber ?? null
                updateData.drivingLicensePhotoUrl = updateData.drivingLicensePhotoUrl ?? null
            }

            updateData.verificationStatus = "pending"
            updateData.rejectionReason = null
        }

        await courierProfile.update(updateData)

        response = {
            success: true,
            message: vehiculeTypeChanged
                ? "Profil mis à jour. Votre nouveau véhicule est en attente de vérification"
                : "Profil livreur mis à jour avec succès",
            data: courierProfile
        }
        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function underReviewProfileService(req, res) {

    try {

        const id = req.params.id
        const courierProfile = await CourierProfile.findByPk(id, {
            include: {
                model: User,
                as: "user"
            }
        })

        let response = {}
        if (!courierProfile) {
            response = {
                success: false,
                message: "Profil livreur introuvable",
                data: courierProfile
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        if (!courierProfile.user) {
            response = {
                success: false,
                message: "Cet profile n'est associé à aucun utilisateur !",
            }

            return res.status(responses.UNPROCESSABLE_ENTITY).json(response)
        }

        await courierProfile.update({ verificationStatus: "under_review" })
        response = {
            success: true,
            message: "Votre profil est passé en cour d'examen !",
            data: courierProfile.user
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function verifyProfileService(req, res) {

    try {

        const id = req.params.id
        const courierProfile = await CourierProfile.findByPk(id, {
            include: {
                model: User,
                as: "user"
            }
        })

        let response = {}
        if (!courierProfile) {
            response = {
                success: false,
                message: "Profil livreur introuvable",
                data: courierProfile
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        if (!courierProfile.user) {
            response = {
                success: false,
                message: "Cet profile n'est associé à aucun utilisateur !",
            }

            return res.status(responses.UNPROCESSABLE_ENTITY).json(response)
        }

        await courierProfile.update({ verificationStatus: "verified" })
        response = {
            success: true,
            message: "Votre profil est enfin vérifié ! Bienvenu parmis nous",
            data: courierProfile.user
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function rejectProfileService(req, res) {

    try {

        const id = req.params.id
        const { rejectionReason } = req.body
        const courierProfile = await CourierProfile.findByPk(id, {
            include: {
                model: User,
                as: "user"
            }
        })

        let response = {}
        if (!courierProfile) {
            response = {
                success: false,
                message: "Profil livreur introuvable",
                data: courierProfile
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        if (!courierProfile.user) {
            response = {
                success: false,
                message: "Cet profile n'est associé à aucun utilisateur !",
            }

            return res.status(responses.UNPROCESSABLE_ENTITY).json(response)
        }

        await courierProfile.update({ verificationStatus: "rejected", rejectionReason: rejectionReason })
        response = {
            success: true,
            message: "Désolé ! Votre profil est réjété",
            data: courierProfile.user
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}


module.exports = {
    completeCourierProfileService,
    updateCourierProfileService,
    underReviewProfileService,
    verifyProfileService,
    rejectProfileService,
}
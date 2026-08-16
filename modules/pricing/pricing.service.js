const CourierProfile = require("../../database/models/tables/couriers.model")
const CourierPricing = require("../../database/models/tables/pricing.model")
const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")

async function getAllPricingsService(req, res) {

    try {

        const pricings = await CourierPricing.findAll({
            include: {
                model: User,
                as: "user",
                include: {
                    model: CourierProfile
                }
            }
        })

        const response = {
            success: true,
            message: pricings.length === 0 ? "Aucun prix fixé par un livreur pour le moment"
                : "Liste des tarif et leurs types",
            data: pricings
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function getOnePricingService(req, res) {

    try {

        const id = req.params.id
        const pricing = await CourierPricing.findByPk(id, {
            include: {
                model: User,
                as: "user",
                include: {
                    model: CourierProfile
                }
            }
        })

        const response = {
            success: Boolean(pricing),
            message: !pricing ? "Tarif livreur introuvable"
                : "Détail du tarif",
            data: pricing
        }

        return res.status(!pricing ? responses.NOT_FOUND : responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function addPricingToCourierService(req, res) {

    try {

        const { userId } = req.body
        const user = await User.findByPk(userId, {
            include: {
                model: CourierPricing,
            },
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
                message: "Cet profile n'est pas profile un livreur",
                data: user
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }
        if (user.CourierPricing) {
            response = {
                success: false,
                message: "Ce profile à déjà un tarif",
                data: user
            }

            return res.status(responses.CONFLICT).json(response)
        }

        const pricingTermsAcceptedAt = new Date(Date.now())

        const newPricing = await CourierPricing.create({
            ...req.body,
            userId,
            pricingTermsAcceptedAt
        }, {
            include: {
                model: User,
                as: "user"
            }
        })

        response = {
            success: true,
            message: "Tarif ajouté avec succès",
            data: newPricing
        }

        return res.status(responses.CREATED).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function updatePricingCourierService(req, res) {

    try {

        const id = req.params.id
        const { userId, pricingType, pricePerMinute, pricePerKm, termsAccepted } = req.body

        const user = await User.findByPk(userId)
        const pricing = await CourierPricing.findByPk(id)

        let response = {}

        if (!pricing) {
            response = {
                success: false,
                message: "Tarif introuvable",
                data: pricing
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

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
                message: "Cet profile n'est pas un profile livreur",
                data: user
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (pricing.userId !== user.id) {
            response = {
                success: false,
                message: "Ce tarif n'appartient pas à cet utilisateur"
            }
            return res.status(responses.UNAUTHORIZED).json(response)
        }

        const pricingTypeChanged = pricingType && pricingType !== pricing.pricingType

        // Valeurs finales en tenant compte de ce qui est déjà en base (pour les checks "obligatoire")
        const finalPricingType = pricingType || pricing.pricingType
        const finalPricePerMinute = pricePerMinute !== undefined ? pricePerMinute : pricing.pricePerMinute
        const finalPricePerKm = pricePerKm !== undefined ? pricePerKm : pricing.pricePerKm

        // Checks "obligatoire" : on regarde la valeur finale (body + base)
        if (finalPricingType === "per_minute" && !finalPricePerMinute) {
            response = {
                success: false,
                message: "Le prix par minute est obligatoire pour ce type de tarif"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (finalPricingType === "per_km" && !finalPricePerKm) {
            response = {
                success: false,
                message: "Le prix par km est obligatoire pour ce type de tarif"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        // Checks "interdit" : on regarde UNIQUEMENT ce que CETTE requête envoie explicitement,
        // pas les valeurs déjà en base (sinon un reliquat historique bloquerait des updates innocents)
        if (finalPricingType === "per_minute" && pricePerKm) {
            response = {
                success: false,
                message: "Le prix par km ne doit pas être renseigné pour ce type de tarif"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (finalPricingType === "per_km" && pricePerMinute) {
            response = {
                success: false,
                message: "Le prix par minute ne doit pas être renseigné pour ce type de tarif"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (finalPricingType === "negotiable" && (pricePerMinute || pricePerKm)) {
            response = {
                success: false,
                message: "Aucun prix ne doit être renseigné pour un tarif négocié"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        // Si le type de tarif change, le livreur doit re-accepter les modalités
        if (pricingTypeChanged && termsAccepted !== true) {
            response = {
                success: false,
                message: "Vous devez accepter les modalités de tarification pour ce nouveau type"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        const updateData = { ...req.body }

        // Nettoyage systématique : le champ non pertinent au type final repasse à null,
        // pour que la base reste toujours cohérente (évite les reliquats qui faussent les checks futurs)
        if (finalPricingType === "per_minute") {
            updateData.pricePerKm = null
        }
        if (finalPricingType === "per_km") {
            updateData.pricePerMinute = null
        }
        if (finalPricingType === "negotiable") {
            updateData.pricePerMinute = null
            updateData.pricePerKm = null
        }

        if (pricingTypeChanged) {
            updateData.pricingTermsAcceptedAt = new Date()
        }

        await pricing.update(updateData)

        response = {
            success: true,
            message: pricingTypeChanged
                ? "Tarif mis à jour, nouveau type de tarification accepté"
                : "Tarif mis à jour avec succès",
            data: pricing
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function deletePricingCourierService(req, res) {

    try {

        const id = req.params.id
        const pricing = await CourierPricing.findByPk(id)

        let response = {}
        if (!pricing) {
            response = {
                success: false,
                message: "Tarif introuvable",
                data: pricing
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        await pricing.destroy()

        response = {
            success: true,
            message: "Tarif supprimé avec succès",
            data: pricing
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

module.exports = {
    getAllPricingsService,
    getOnePricingService,
    addPricingToCourierService,
    updatePricingCourierService,
    deletePricingCourierService
}
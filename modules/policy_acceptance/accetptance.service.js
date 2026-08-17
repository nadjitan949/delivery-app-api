const PolicyAcceptance = require("../../database/models/tables/acceptancePolicy.model")
const Policy = require("../../database/models/tables/policies.model")
const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")

async function getAllPolicyAcceptancesService(req, res) {

    try {

        const acceptances = await PolicyAcceptance.findAll({
            include: [
                { model: User },
                { model: Policy }
            ],
            order: [["acceptedAt", "DESC"]]
        })

        const response = {
            success: true,
            message: acceptances.length === 0
                ? "Aucune acceptation trouvée pour le moment"
                : "Liste des acceptations",
            data: acceptances
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

async function getOnePolicyAcceptanceService(req, res) {

    try {

        const id = req.params.id
        const acceptance = await PolicyAcceptance.findByPk(id, {
            include: [
                { model: User },
                { model: Policy }
            ]
        })

        const response = {
            success: Boolean(acceptance),
            message: !acceptance ? "Acceptation introuvable" : "Détails de l'acceptation",
            data: acceptance
        }

        return res.status(!acceptance ? responses.NOT_FOUND : responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

module.exports = {
    getAllPolicyAcceptancesService,
    getOnePolicyAcceptanceService
}
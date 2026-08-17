const responses = require("../../messages/responses")
const {
    getAllPolicyAcceptancesService,
    getOnePolicyAcceptanceService
} = require("./accetptance.service")

async function getAllPolicyAcceptancesController(req, res) {

    try {

        await getAllPolicyAcceptancesService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function getOnePolicyAcceptanceController(req, res) {

    try {

        await getOnePolicyAcceptanceService(req, res)

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
    getAllPolicyAcceptancesController,
    getOnePolicyAcceptanceController
}
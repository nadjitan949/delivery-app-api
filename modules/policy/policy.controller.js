const responses = require("../../messages/responses")
const {
    getAllPoliciesService,
    getOnePolicyService,
    addPolicyService,
    updatePolicyService,
    deletePolicyService
} = require("./policy.service")

async function getAllPoliciesController(req, res) {

    try {

        await getAllPoliciesService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function getOnePolicyController(req, res) {

    try {

        await getOnePolicyService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function addPolicyController(req, res) {

    try {

        await addPolicyService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function updatePolicyController(req, res) {

    try {

        await updatePolicyService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function deletePolicyController(req, res) {

    try {

        await deletePolicyService(req, res)

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
    getAllPoliciesController,
    getOnePolicyController,
    addPolicyController,
    updatePolicyController,
    deletePolicyController
}
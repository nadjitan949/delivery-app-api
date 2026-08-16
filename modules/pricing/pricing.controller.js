const responses = require("../../messages/responses")
const {
    getAllPricingsService,
    getOnePricingService,
    addPricingToCourierService,
    updatePricingCourierService,
    deletePricingCourierService
} = require("./pricing.service")

async function getAllPricingsController(req, res) {

    try {

        await getAllPricingsService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function getOnePricingController(req, res) {

    try {

        await getOnePricingService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function addPricingToCourierController(req, res) {

    try {

        await addPricingToCourierService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function updatePricingCourierController(req, res) {

    try {

        await updatePricingCourierService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function deletePricingCourierController(req, res) {

    try {

        await deletePricingCourierService(req, res)

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
    getAllPricingsController,
    getOnePricingController,
    addPricingToCourierController,
    updatePricingCourierController,
    deletePricingCourierController
}
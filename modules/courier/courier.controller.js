const responses = require("../../messages/responses")
const {
    completeCourierProfileService,
    underReviewProfileService,
    verifyProfileService,
    rejectProfileService,
    updateCourierProfileService,
    banCourierService,
    suspendCourierService,
    deactivateCourierService
} = require("./courier.service")

async function completeCourierProfileController(req, res) {

    try {

        await completeCourierProfileService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function updateCourierProfileController(req, res) {

    try {

        await updateCourierProfileService(req, res)
        
    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }
    
}

async function underReviewProfileController(req, res) {

    try {

        await underReviewProfileService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function verifyProfileController(req, res) {

    try {

        await verifyProfileService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function rejectProfileController(req, res) {

    try {

        await rejectProfileService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function banCourierController(req, res) {

    try {

        await banCourierService(req, res)
        
    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }
    
}

async function activateCourierController(req, res) {

    try {

        await activateCourierService(req, res)
        
    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }
    
}

async function suspendCourierController(req, res) {

    try {

        await suspendCourierService(req, res)
        
    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }
    
}

async function deactivateCourierController(req, res) {

    try {

        await deactivateCourierService(req, res)
        
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
    completeCourierProfileController,
    updateCourierProfileController,
    underReviewProfileController,
    verifyProfileController,
    rejectProfileController,
    banCourierController,
    activateCourierController,
    suspendCourierController,
    deactivateCourierController
}
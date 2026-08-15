const responses = require("../../messages/responses")
const {
    getAllOtpService,
    getOneOtpService,
    deleteOtpService,
    verifyOtpService,
    resendOtpService
} = require("./otp.service")

async function getAllOtpController(req, res) {

    try {

        await getAllOtpService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function getOneOtpController(req, res) {

    try {

        await getOneOtpService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function deleteOtpController(req, res) {

    try {

        await deleteOtpService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function verifyOtpController(req, res) {

    try {

        await verifyOtpService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function resendOtpController(req, res) {

    try {

        await resendOtpService(req, res)

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
    getAllOtpController,
    getOneOtpController,
    deleteOtpController,
    verifyOtpController,
    resendOtpController
}
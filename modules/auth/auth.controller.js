const { registerService, loginService } = require("./auth.service")

async function registerController(req, res) {

    try {

        await registerService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function loginController(req, res) {

    try {

        await loginService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

module.exports = { registerController, loginController }
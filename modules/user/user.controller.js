const responses = require("../../messages/responses")
const {
    getAllUsersService,
    getOneUserService,
    createUserService,
    updateUserService,
    resteUserPasswordService,
    deleteUserService
} = require("./user.service")

async function getAllUsersController(req, res) {

    try {

        await getAllUsersService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function getOneUserController(req, res) {

    try {

        await getOneUserService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function createUserController(req, res) {

    try {

        await createUserService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function updateUserController(req, res) {

    try {
        await updateUserService(req, res)
    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function resetUserPasswordController(req, res) {

    try {

        await resteUserPasswordService(req, res)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function deleteUserController(req, res) {

    try {

        await deleteUserService(req, res)

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
    getAllUsersController,
    getOneUserController,
    createUserController,
    updateUserController,
    resetUserPasswordController,
    deleteUserController
}
const CourierProfile = require("../../database/models/tables/couriers.model")
const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")
const bcrypt = require("bcrypt")
const { deleteFolderFromCloudinary } = require("../../utils/uploadToCloudinary")

async function getAllUsersService(req, res) {

    try {

        const users = await User.findAll({
            include: {
                model: CourierProfile
            }
        })

        const response = {
            success: true,
            message: users.length === 0 ? "Aucun utilisateur enregistré pour le moment" : "Liste des utilisateurs",
            data: users
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

async function getOneUserService(req, res) {

    try {

        const id = req.params.id
        const user = await User.findByPk(id, {
            include: {
                model: CourierProfile
            }
        })

        const response = {
            success: Boolean(user),
            message: !user ? "Utilisateur introuvable" : "Détails de l'utilisateur",
            data: user
        }

        return res.status(!user ? responses.NOT_FOUND : responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error
        })
    }

}

async function createUserService(req, res) {

    try {

        const { email, phone, password } = req.body
        const existUser = await User.findOne({
            where: email ? { email } : { phone },
            paranoid: false
        })

        let response = {}
        if (existUser) {
            response = {
                success: false,
                message: email ?
                    "Cet email est déjà utilisé par un autre compte" :
                    "Ce numéro de téléphone est déjà associé à un autre compte"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ ...req.body, password: hashedPassword })
        response = {
            success: true,
            message: "Utilisateur crée avec succès",
            data: newUser
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

async function updateUserService(req, res) {

    try {

        const id = req.params.id
        const { email, phone } = req.body

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(responses.NOT_FOUND).json({
                success: false,
                message: "Utilisateur introuvable"
            })
        }

        const existEmail = email && user.email !== email && await User.findOne({ where: { email }, paranoid: false })
        const existPhone = phone && user.phone !== phone && await User.findOne({ where: { phone }, paranoid: false })

        if (existEmail || existPhone) {
            return res.status(responses.CONFLICT).json({
                success: false,
                message: existEmail
                    ? "Cet email est déjà occupé par un autre utilisateur"
                    : "Ce numero de téléphone est déjà utilisé par un autre utilisateur"
            })
        }

        await user.update(req.body)

        return res.status(responses.OK).json({
            success: true,
            message: "Utilisateur mis à jour avec succès",
            data: user
        })

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function resteUserPasswordService(req, res) {

    try {

        const id = req.params.id
        const { password } = req.body
        const user = await User.findByPk(id)

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable !",
                data: user
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await user.update({ password: hashedPassword })

        response = {
            success: true,
            message: "Mote de pass de l'utilisateur mis à jour avec succès !",
            data: user
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

async function deleteUserService(req, res) {

    try {

        const id = req.params.id
        const user = await User.findByPk(id)

        let response
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable !",
                data: user
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        await deleteFolderFromCloudinary(`couriers/${id}`)

        await user.destroy()

        response = {
            success: true,
            message: "Utilisateur supprimé"
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

async function activeUserService(req, res) {

    try {

        const id = req.params.id
        const user = await User.findByPk(id)

        let response
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable"
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (user.status === "active") {
            response = {
                success: false,
                message: "L'utilisateur est déjà active",
                data: user
            }

            return res.status(responses.BAD_REQUEST).json(response)
        }

        await user.update({ status: "active", reason: null })
        response = {
            success: true,
            message: "L'utilisateur est maintenant actif",
            data: user
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

async function banUserService(req, res) {

    try {

        const id = req.params.id
        const { reason } = req.body
        const user = await User.findByPk(id)

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable"
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (user.status === "banned") {
            response = {
                success: false,
                message: "L'utilisateur est déjà banni",
                data: user
            }

            return res.status(responses.BAD_REQUEST).json(response)
        }

        await user.update({ status: "banned", reason: reason ? reason : null })
        response = {
            success: true,
            message: "L'utilisateur a été banni avec succès",
            data: user
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

async function suspendUserService(req, res) {

    try {

        const id = req.params.id
        const { reason } = req.body
        const user = await User.findByPk(id)

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable"
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (user.status === "suspended") {
            response = {
                success: false,
                message: "L'utilisateur est déjà suspendu",
                data: user
            }

            return res.status(responses.BAD_REQUEST).json(response)
        }

        await user.update({ status: "suspended", reason: reason ? reason : null })
        response = {
            success: true,
            message: "L'utilisateur a été suspendu avec succès",
            data: user
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

async function deactivateUserService(req, res) {

    try {

        const id = req.params.id
        const { reason } = req.body
        const user = await User.findByPk(id)

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable"
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (user.status === "inactive") {
            response = {
                success: false,
                message: "L'utilisateur est déjà désactivé",
                data: user
            }

            return res.status(responses.BAD_REQUEST).json(response)
        }

        await user.update({ status: "inactive", reason: reason ? reason : null })
        response = {
            success: true,
            message: "L'utilisateur a été désactivé avec succès",
            data: user
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

module.exports = {
    getAllUsersService,
    getOneUserService,
    createUserService,
    updateUserService,
    resteUserPasswordService,
    deleteUserService,
    activeUserService,
    banUserService,
    suspendUserService,
    deactivateUserService
}
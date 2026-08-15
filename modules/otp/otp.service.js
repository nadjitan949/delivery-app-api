const Otp = require("../../database/models/tables/otps.model")
const responses = require("../../messages/responses")
const bcrypt = require("bcrypt")
const User = require("../../database/models/tables/users.model")
const crypto = require("crypto")

async function getAllOtpService(req, res) {

    try {

        const otps = await Otp.findAll()

        const response = {
            success: true,
            message: otps.length === 0 ? "Aucun otp n'à été demandé pour le moment" : "Liste des demandes de confirmation",
            data: otps
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

async function getOneOtpService(req, res) {

    try {

        const id = req.params.id
        const otp = await Otp.findByPk(id)

        const response = {
            success: Boolean(otp),
            message: !otp ? "Otp introuvable" : "Details de l'otp",
            data: otp
        }

        return res.status(!otp ? responses.NOT_FOUND : responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function deleteOtpService(req, res) {

    try {

        const id = req.params.id
        const otp = await Otp.findByPk(id)
        let response = {}
        if (!otp) {
            response = {
                success: false,
                message: "Otp introuvable"
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        await otp.destroy()
        response = {
            success: true,
            message: "Otp supprimé"
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

async function verifyOtpService(req, res) {

    try {

        const { email, phone, firstname, lastname, password, code } = req.body

        if (!code) {
            return res.status(responses.BAD_REQUEST).json({
                success: false,
                message: "Le code de vérification est obligatoire"
            })
        }

        const identifier = email ? email : phone
        const otpRecord = await Otp.findOne({
            where: { sender: identifier },
            order: [["createdAt", "DESC"]]
        })

        let response = {}
        if (!otpRecord) {
            response = {
                success: false,
                message: "Aucun code n'a été demandé pour cet identifiant"
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        if (otpRecord.expiresAt < new Date()) {
            await otpRecord.destroy()
            response = {
                success: false,
                message: "Ce code a expiré, veuillez en redemander un nouveau"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        if (otpRecord.attempts >= 5) {
            await otpRecord.destroy()
            response = {
                success: false,
                message: "Trop de tentatives, veuillez redemander un nouveau code"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        // Vérification RÉELLE du code envoyé contre le hash stocké
        const isValidCode = await bcrypt.compare(code, otpRecord.code)

        if (!isValidCode) {
            await otpRecord.update({ attempts: otpRecord.attempts + 1 })
            response = {
                success: false,
                message: "Code invalide"
            }
            return res.status(responses.BAD_REQUEST).json(response)
        }

        switch (otpRecord.source) {

            case "register": {
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await User.create({
                    firstname,
                    lastname,
                    email: email || null,
                    phone: phone || null,
                    password: hashedPassword
                })

                await otpRecord.destroy()

                response = {
                    success: true,
                    message: "Votre compte a été créé avec succès",
                    data: newUser
                }
                return res.status(responses.CREATED).json(response)
            }

            case "forgot-password":
            case "reset-password": {
                const user = await User.findOne({ where: email ? { email } : { phone } })

                if (!user) {
                    response = {
                        success: false,
                        message: "Utilisateur introuvable"
                    }
                    return res.status(responses.NOT_FOUND).json(response)
                }

                const hashedPassword = await bcrypt.hash(password, 10)
                await user.update({ password: hashedPassword })

                await otpRecord.destroy()

                response = {
                    success: true,
                    message: "Votre mot de passe a été mis à jour avec succès"
                }
                return res.status(responses.OK).json(response)
            }

            default: {
                response = {
                    success: false,
                    message: "Source de vérification inconnue"
                }
                return res.status(responses.BAD_REQUEST).json(response)
            }

        }

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function resendOtpService(req, res) {

    try {

        const { email, phone, source } = req.body
        const identifier = email ? email : phone
        const user = await User.findOne({ where: email ? { email } : { phone } })

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: "Utilisateur introuvable"
            }
        }

        const lastOtp = await Otp.findOne({
            where: { sender: identifier },
            order: [["createdAt", "DESC"]]
        })

        if (lastOtp) {
            await lastOtp.destroy()
        }

        const otp = crypto.randomInt(100000, 999999).toString()
        const hashedOtp = await bcrypt.hash(otp, 10)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        await Otp.create({
            sender: identifier,
            source: source,
            code: hashedOtp,
            expiresAt: expiresAt
        })

        response = {
            success: true,
            message: "Un nouveau code vous à été envoyé",
            data: otp
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
    getAllOtpService,
    getOneOtpService,
    deleteOtpService,
    verifyOtpService,
    resendOtpService
}
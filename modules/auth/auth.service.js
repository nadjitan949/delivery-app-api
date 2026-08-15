const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const Otp = require("../../database/models/tables/otps.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function generateOtp() {
    const otp = crypto.randomInt(100000, 999999).toString()
    return otp
}

async function registerService(req, res) {

    try {

        const { email, phone } = req.body
        const identifier = email ? email : phone
        const existUser = await User.findOne({ where: email ? { email } : { phone } })

        let response = {}
        if (existUser) {
            response = {
                success: false,
                message: email ? "Cet email est déjà associé à un autre compte"
                    : "Ce numéro de téléphone est déjà associé à un autre compte"
            }
            return res.status(responses.CONFLICT).json(response)
        }
        const otp = await generateOtp()
        const hashedOtp = await bcrypt.hash(otp, 10)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        await Otp.create({
            sender: identifier,
            source: "register",
            code: hashedOtp,
            expiresAt
        })

        response = {
            success: true,
            message: email ? "Un code à 6 chiffres à été envoyé à votre email ! Verifiez là et venir confirmer"
                : "Un code à 6 chiffres à été envoyé à votre numéro de téléphone ! Verifiez là et venir confirmer",
            data: otp,
        }

        return res.status(responses.CREATED).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function loginService(req, res) {

    try {

        const { email, phone, password } = req.body
        const user = await User.findOne({ where: email ? { email } : { phone } })

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: email ? "Email ou mot de pass incorrect !"
                    : "Numéro de téléphone ou mot de passe incorrect !"
            }
            return res.status(responses.UNAUTHORIZED).json(response)
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            response = {
                success: false,
                message: email ? "Email ou mot de pass incorrect !"
                    : "Numéro de téléphone ou mot de passe incorrect !"
            }
            return res.status(responses.UNAUTHORIZED).json(response)
        }

        const payload = {
            id: user.id,
            role: user.role
        }

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_JWT_SECRET,
            { expiresIn: process.env.ACCESS_JWT_EXPIRE_IN }
        )

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: process.env.REFRESH_JWT_EXPIRE_IN }
        )


        response = {
            success: true,
            message: "Bienvenus sur votre compte",
            data: user,
            accessToken,
            refreshToken
        }

        return res.status(responses.ACCEPTED).json(response)


    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function forgotPasswodrService(req, res) {

    try {

        const { email, phone, password } = req.body
        const identifier = email ? email : phone
        const user = await User.findOne({ where: email ? { email } : { phone } })

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: email ? "Cet email n'est associé à aucun compte"
                    : "Ce numéro de téléphone n'est associé à aucun compte"
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        const otp = await generateOtp()
        const hashedOtp = await bcrypt.hash(otp, 10)
        expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await Otp.create({
            sender: identifier,
            source: "forgot-password",
            expiresAt,
            code: hashedOtp
        })

        response = {
            success: true,
            message: email ? "Une code de véridication à été envoté à votre email"
                : "Un code de vérification a été envoté à votre numéro de téléphone",
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

async function resetPasswordService(req, res) {

    try {
        const { email, phone, oldPassword } = req.body
        const identifier = email ? email : phone
        const user = await User.findOne({ where: email ? { email } : { phone } })

        let response = {}
        if (!user) {
            response = {
                success: false,
                message: email ? "Cet email n'est associé à aucun compte"
                    : "Ce numéro de téléphone n'est associé à aucun compte"
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            response = {
                success: false,
                message: "Le mot de passe ne corresponds pas à l'encien mot de passe"
            }

            return res.status(responses.BAD_REQUEST).json(response)
        }

        const otp = await generateOtp()
        const hashedOtp = await bcrypt.hash(otp, 10)
        expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await Otp.create({
            sender: identifier,
            source: "forgot-password",
            expiresAt,
            code: hashedOtp
        })

        response = {
            success: true,
            message: email ? "Une code de véridication à été envoté à votre email"
                : "Un code de vérification a été envoté à votre numéro de téléphone",
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

module.exports = { registerService, loginService, forgotPasswodrService, resetPasswordService }
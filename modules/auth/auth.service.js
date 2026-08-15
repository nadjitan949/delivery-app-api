const User = require("../../database/models/tables/users.model")
const responses = require("../../messages/responses")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const Otp = require("../../database/models/tables/otps.model")

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
        const otp = crypto.randomInt(100000, 999999).toString()
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

module.exports = registerService
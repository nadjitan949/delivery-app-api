const express = require("express")
const {
    getAllOtpController,
    getOneOtpController,
    deleteOtpController,
    verifyOtpController,
    resendOtpController
} = require("./otp.controller")
const validate = require("../../middleware/validator/validate")
const { verifyOtpSchema, resendOtpSchema } = require("./otp.schema")

const otpRoute = express.Router()

otpRoute.get("/all", getAllOtpController)
otpRoute.get("/details/:id", getOneOtpController)
otpRoute.post("/verify", validate(verifyOtpSchema), verifyOtpController)
otpRoute.post("/resend", validate(resendOtpSchema), resendOtpController)
otpRoute.delete("/delete/:id", deleteOtpController)

module.exports = otpRoute
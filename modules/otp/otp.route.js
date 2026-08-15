const express = require("express")
const {
    getAllOtpController,
    getOneOtpController,
    deleteOtpController,
    verifyOtpController,
    resendOtpController
} = require("./otp.controller")

const otpRoute = express.Router()

otpRoute.get("/all", getAllOtpController)
otpRoute.get("/details/:id", getOneOtpController)
otpRoute.post("/verify", verifyOtpController)
otpRoute.post("/resend", resendOtpController)
otpRoute.delete("/delete/:id", deleteOtpController)

module.exports = otpRoute
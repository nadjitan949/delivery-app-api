const express = require("express")
const { registerController, loginController, forgotPasswodrController, resetPasswordController } = require("./auth.controller")

const authRoute = express.Router()

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.post("/forgot-password", forgotPasswodrController)
authRoute.post("/reset-password", resetPasswordController)

module.exports = authRoute
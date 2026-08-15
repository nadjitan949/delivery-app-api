const express = require("express")
const { registerController, loginController, forgotPasswodrController } = require("./auth.controller")

const authRoute = express.Router()

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)
authRoute.post("/forgot-password", forgotPasswodrController)

module.exports = authRoute
const express = require("express")
const { registerController, loginController } = require("./auth.controller")

const authRoute = express.Router()

authRoute.post("/register", registerController)
authRoute.post("/login", loginController)

module.exports = authRoute
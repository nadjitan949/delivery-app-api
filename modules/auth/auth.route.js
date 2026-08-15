const express = require("express")
const registerController = require("./auth.controller")

const authRoute = express.Router()

authRoute.post("/register", registerController)

module.exports = authRoute
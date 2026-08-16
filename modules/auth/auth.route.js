const express = require("express")
const {
    registerController,
    loginController,
    resetPasswordController,
    forgotPasswordController
} = require("./auth.controller")
const validate = require("../../middleware/validator/validate")
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("./auth.schema")

const authRoute = express.Router()

authRoute.post("/register", validate(registerSchema), registerController)
authRoute.post("/login", validate(loginSchema), loginController)
authRoute.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController)
authRoute.post("/reset-password", validate(resetPasswordSchema), resetPasswordController)

module.exports = authRoute
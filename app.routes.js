const express = require("express")
const userRoute = require("./modules/user/user.route")
const seedRoute = require("./seed/seeder.route")
const courierRoute = require("./modules/courier/courier.route")
const authRoute = require("./modules/auth/auth.route")
const otpRoute = require("./modules/otp/otp.route")

const appRoute = express.Router()

appRoute.use("/users", userRoute)
appRoute.use("/seeder", seedRoute)
appRoute.use("/courier", courierRoute)
appRoute.use("/auth", authRoute)
appRoute.use("/otp", otpRoute)

module.exports = appRoute
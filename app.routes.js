const express = require("express")
const userRoute = require("./modules/user/user.route")
const seedRoute = require("./seed/seeder.route")
const courierRoute = require("./modules/courier/courier.route")
const authRoute = require("./modules/auth/auth.route")
const otpRoute = require("./modules/otp/otp.route")
const pricingRoute = require("./modules/pricing/pricing.route")
const policyRoute = require("./modules/policy/policy.route")
const acceptanceRoute = require("./modules/policy_acceptance/acceptence.route")

const appRoute = express.Router()

appRoute.use("/users", userRoute)
appRoute.use("/seeder", seedRoute)
appRoute.use("/courier", courierRoute)
appRoute.use("/auth", authRoute)
appRoute.use("/otp", otpRoute)
appRoute.use("/pricing", pricingRoute)
appRoute.use("/policies", policyRoute)
appRoute.use("/policies-acceptance", acceptanceRoute)

module.exports = appRoute
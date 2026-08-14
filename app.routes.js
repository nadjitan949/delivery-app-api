const express = require("express")
const userRoute = require("./modules/user/user.route")
const seedRoute = require("./seed/seeder.route")
const courierRoute = require("./modules/courier/courier.route")

const appRoute = express.Router()

appRoute.use("/users", userRoute)
appRoute.use("/seeder", seedRoute)
appRoute.use("/courier", courierRoute)

module.exports = appRoute
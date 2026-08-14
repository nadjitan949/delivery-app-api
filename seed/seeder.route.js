const { populate } = require("dotenv")
const express = require("express")
const { seedDatabaseController } = require("./seeder")

const seedRoute = express.Router()

seedRoute.post("/populate", seedDatabaseController)

module.exports = seedRoute
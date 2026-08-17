const express = require("express")
const {
    getAllPolicyAcceptancesController,
    getOnePolicyAcceptanceController
} = require("./acceptence.controller")

const acceptanceRoute = express.Router()

acceptanceRoute.get("/all", getAllPolicyAcceptancesController)
acceptanceRoute.get("/details/:id", getOnePolicyAcceptanceController)

module.exports = acceptanceRoute
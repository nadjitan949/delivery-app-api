const express = require("express")
const {
    getAllPricingsController,
    getOnePricingController,
    addPricingToCourierController,
    updatePricingCourierController,
    deletePricingCourierController
} = require("./pricing.controller")
const validate = require("../../middleware/validator/validate")
const { addPricingToCourierSchema, updatePricingToCourierSchema } = require("./pricing.schema")

const pricingRoute = express.Router()

pricingRoute.get("/all", getAllPricingsController)
pricingRoute.get("/details/:id", getOnePricingController)

pricingRoute.post("/add", validate(addPricingToCourierSchema), addPricingToCourierController)
pricingRoute.put("/update/:id", validate(updatePricingToCourierSchema), updatePricingCourierController)
pricingRoute.delete("/delete/:id", deletePricingCourierController)

module.exports = pricingRoute
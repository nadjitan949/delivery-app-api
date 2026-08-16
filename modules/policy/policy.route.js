const express = require("express")
const {
    getAllPoliciesController,
    getOnePolicyController,
    addPolicyController,
    updatePolicyController,
    deletePolicyController
} = require("./policy.controller")

const validate = require("../../middleware/validator/validate")
const { addPolicySchema, updatePolicySchema } = require("./policy.schema")

const policyRoute = express.Router()

policyRoute.get("/all", getAllPoliciesController)
policyRoute.get("/details/:id", getOnePolicyController)
policyRoute.post("/add", validate(addPolicySchema), addPolicyController)
policyRoute.put("/update/:id", validate(updatePolicySchema), updatePolicyController)
policyRoute.delete("/delete/:id", deletePolicyController)

module.exports = policyRoute
const { z } = require("zod")

const addPolicySchema = z.object({
    type: z.enum(["generale", "policy_pricing_per_minute", "policy_pricing_per_km", "policy_pricing_negotiable"], { message: "Type de condition inconnus" }),
    content: z.string().min(1, "Veuillez redigez la politique d'utilisation s'il vous plaît")
}).strict()

const updatePolicySchema = z.object({
    type: z.enum(["generale", "policy_pricing_per_minute", "policy_pricing_per_km", "policy_pricing_negotiable"], { message: "Type de condition inconnus" }).optional(),
    content: z.string().min(1, "Veuillez redigez la politique d'utilisation s'il vous plaît").optional()
}).strict()

module.exports = { addPolicySchema, updatePolicySchema }
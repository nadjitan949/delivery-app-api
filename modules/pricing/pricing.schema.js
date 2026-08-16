const { z } = require("zod")

const addPricingToCourierSchema = z.object({

    pricingType: z.enum(["per_minute", "per_km", "negotiable"], { message: "Type de tarif inconnu !" }),
    pricePerMinute: z.coerce.number().positive("Le prix par minute doit être supérieur à 0").optional(),
    pricePerKm: z.coerce.number().positive("Le prix par km doit être supérieur à 0").optional(),

    userId: z.coerce.number({ message: "Veuillez indiquer le livreur" }),

    termsAccepted: z.literal(true, { message: "Vous devez accepter les modalités de tarification" })

}).strict()
    // per_minute : pricePerMinute obligatoire, pricePerKm interdit
    .refine(data => data.pricingType !== "per_minute" || Boolean(data.pricePerMinute), {
        message: "Le prix par minute est obligatoire pour ce type de tarif",
        path: ["pricePerMinute"]
    })
    .refine(data => data.pricingType !== "per_minute" || data.pricePerKm === undefined, {
        message: "Le prix par km ne doit pas être renseigné pour ce type de tarif",
        path: ["pricePerKm"]
    })
    // per_km : pricePerKm obligatoire, pricePerMinute interdit
    .refine(data => data.pricingType !== "per_km" || Boolean(data.pricePerKm), {
        message: "Le prix par km est obligatoire pour ce type de tarif",
        path: ["pricePerKm"]
    })
    .refine(data => data.pricingType !== "per_km" || data.pricePerMinute === undefined, {
        message: "Le prix par minute ne doit pas être renseigné pour ce type de tarif",
        path: ["pricePerMinute"]
    })
    // negotiable : aucun prix accepté
    .refine(data => data.pricingType !== "negotiable" || data.pricePerMinute === undefined, {
        message: "Aucun prix ne doit être renseigné pour un tarif négocié",
        path: ["pricePerMinute"]
    })
    .refine(data => data.pricingType !== "negotiable" || data.pricePerKm === undefined, {
        message: "Aucun prix ne doit être renseigné pour un tarif négocié",
        path: ["pricePerKm"]
    })

const updatePricingToCourierSchema = z.object({

    pricingType: z.enum(["per_minute", "per_km", "negotiable"], { message: "Type de tarif inconnu !" }).optional(),
    pricePerMinute: z.coerce.number().positive("Le prix par minute doit être supérieur à 0").optional(),
    pricePerKm: z.coerce.number().positive("Le prix par km doit être supérieur à 0").optional(),

    userId: z.coerce.number({ message: "Veuillez indiquer le livreur" }),

    termsAccepted: z.literal(true, { message: "Vous devez accepter les modalités de tarification" }).optional()

}).strict()

module.exports = { addPricingToCourierSchema, updatePricingToCourierSchema }
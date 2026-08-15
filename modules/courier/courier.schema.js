const { z } = require("zod")

const completeCourierProfileSchema = z.object({
    documentType: z.enum(["passeport", "identity_card", "residence_card"],
        { message: "Type de document non valide. Veuillez soumettre un passeport, une carte d'identité ou une carte de résidence à jour" }
    ),
    documentNumber: z.string().min(1, "Veuillez fournir le numéro de votre document"),
    documentPhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre document"),
    selfiePhotoUrl: z.string().min(1, "Veuillez fournir une photo de vous"),

    vehicleType: z.enum(["car", "motorcycle", "tricycle", "bicycle"], { message: "Type de véhicule inconnu" }),
    vehiculePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre véhicule"),
    vehiclePlateNumber: z.string().min(1, "Veuillez fournir votre plaque d'immatriculation").optional(),
    vehiclePlatePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre plaque d'immatriculation").optional(),
    vehicleDescription: z.string().min(1, "Veuillez fournir une description de votre véhicule"),
    drivingLicenseNumber: z.string().min(1, "Veuillez renseigner votre numéro de permis de conduire").optional(),
    drivingLicensePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre permis de conduire").optional()

}).strict()
    .refine(data => data.vehicleType === "bicycle" || Boolean(data.vehiclePlateNumber), {
        message: "La plaque d'immatriculation est obligatoire pour ce type de véhicule",
        path: ["vehiclePlateNumber"]
    })
    .refine(data => data.vehicleType === "bicycle" || Boolean(data.vehiclePlatePhotoUrl), {
        message: "La photo de la plaque d'immatriculation est obligatoire pour ce type de véhicule",
        path: ["vehiclePlatePhotoUrl"]
    })
    .refine(data => data.vehicleType !== "car" || Boolean(data.drivingLicenseNumber), {
        message: "Le numéro de permis de conduire est obligatoire pour une voiture",
        path: ["drivingLicenseNumber"]
    })
    .refine(data => data.vehicleType !== "car" || Boolean(data.drivingLicensePhotoUrl), {
        message: "La photo du permis de conduire est obligatoire pour une voiture",
        path: ["drivingLicensePhotoUrl"]
    })

const updateCourierProfileSchema = z.object({
    documentType: z.enum(["passeport", "identity_card", "residence_card"],
        { message: "Type de document non valide. Veuillez soumettre un passeport, une carte d'identité ou une carte de résidence à jour" }
    ).optional(),
    documentNumber: z.string().min(1, "Veuillez fournir le numéro de votre document").optional(),
    documentPhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre document").optional(),
    selfiePhotoUrl: z.string().min(1, "Veuillez fournir une photo de vous").optional(),

    vehicleType: z.enum(["car", "motorcycle", "tricycle", "bicycle"], { message: "Type de véhicule inconnu" }).optional(),
    vehiculePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre véhicule").optional(),
    vehiclePlateNumber: z.string().min(1, "Veuillez fournir votre plaque d'immatriculation").optional(),
    vehiclePlatePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre plaque d'immatriculation").optional(),
    vehicleDescription: z.string().min(1, "Veuillez fournir une description de votre véhicule").optional(),
    drivingLicenseNumber: z.string().min(1, "Veuillez renseigner votre numéro de permis de conduire").optional(),
    drivingLicensePhotoUrl: z.string().min(1, "Veuillez fournir une photo de votre permis de conduire").optional()

}).strict()

const rejectProfileSchema = z.object({
    rejectionReason: z.string().min(1, "Veuillez indiquer la raison du rejet")
}).strict()

module.exports = { completeCourierProfileSchema, updateCourierProfileSchema, rejectProfileSchema }
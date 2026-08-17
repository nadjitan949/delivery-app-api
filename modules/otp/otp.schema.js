const { z } = require("zod")

function atLeastOneRefine(data) {
    return Boolean(data.email || data.phone)
}

const atLeastOneMessage = {
    message: "Veuillez fournir un email ou un numéro de téléphone"
}

function notBothRefine(data) {
    return !(data.email && data.phone)
}

const notBothMessage = {
    message: "Veuillez fournir soit un email, soit un numéro de téléphone, pas les deux"
}

const verifyOtpSchema = z.object({
    firstname: z.string().min(1, "Veuillez fournir votre nom").optional(),
    lastname: z.string().min(1, "Veuillez fournir votre prénom").optional(),
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
    code: z.string().min(1, "Veuillez fournir le code de vérification"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    termsAccepted: z.literal(true, { message: "Vous devez accepter les conditions générales" }).optional()

}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

const resendOtpSchema = z.object({
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
    source: z.enum(["register", "forgot-password", "reset-password"], { message: "Source inconnue !" })
}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

module.exports = { verifyOtpSchema, resendOtpSchema }
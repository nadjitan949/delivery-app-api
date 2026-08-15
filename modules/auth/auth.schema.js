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

const registerSchema = z.object({
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

const loginSchema = z.object({
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

const forgotPasswordSchema = z.object({
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

const resetPasswordSchema = z.object({
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),
    oldPassword: z.string().min(1, "Veuillez renseigner l'ancien mot de passe")
}).strict()
    .refine(atLeastOneRefine, atLeastOneMessage)
    .refine(notBothRefine, notBothMessage)

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema }
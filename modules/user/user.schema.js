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

const createUserSchema = z.object({

    firstname: z.string().min(1, "Veuillez fournir le nom de l'utilisateur"),
    lastname: z.string().min(1, "Veuillez fournir le prenom de l'utilisateur"),
    role: z.enum(["supplier", "courier", "admin"], { message: "Rôle invalide" }),
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

const updateUserSchema = z.object({

    firstname: z.string().min(1, "Veuillez fournir le nom de l'utilisateur").optional(),
    lastname: z.string().min(1, "Veuillez fournir le prenom de l'utilisateur").optional(),
    role: z.enum(["supplier", "courier", "admin"], { message: "Rôle invalide" }).optional(),
    email: z.string().email("Veuillez fournir un email valide").optional(),
    phone: z.string().regex(/^[0-9]{8,15}$/, "Le numéro de téléphone n'est pas valide").optional(),

}).strict()

const resetUserPasswordSchema = z.object({
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
})

const banUserSchema = z.object({
    reason: z.string().min(1, "Veuillez indiquer la raison du banissement").optional()
})

const suspendUserSchema = z.object({
    reason: z.string().min(1, "Veuillez indiquer la raison de la suspension de ce compte").optional()
})

const deactiveUserSchema = z.object({
    reason: z.string().min(1, "Veuillez indiquer la raison du desactivement de ce compte").optional()
})

module.exports = {
    createUserSchema,
    updateUserSchema,
    resetUserPasswordSchema,
    banUserSchema,
    suspendUserSchema,
    deactiveUserSchema
}
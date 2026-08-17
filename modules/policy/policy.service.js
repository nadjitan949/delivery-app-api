const Policy = require("../../database/models/tables/policies.model")
const responses = require("../../messages/responses")

async function getAllPoliciesService(req, res) {

    try {

        const policies = await Policy.findAll()

        const response = {
            success: true,
            message: policies.length === 0 ? "Aucune condition d'utilisation n'a été etablie"
                : "Liste des politiques d'utilisations",
            data: policies
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function getOnePolicyService(req, res) {

    try {

        const id = req.params.id
        const policy = await Policy.findByPk(id)

        const response = {
            success: Boolean(policy),
            message: !policy ? "Condition d'utilisation introuvable"
                : "Detail de la condition d'utilisation",
            data: policy
        }

        return res.status(!policy ? responses.NOT_FOUND : responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function addPolicyService(req, res) {

    try {

        const { type } = req.body
        const policy = await Policy.findOne({ where: { type } })

        let response = {}
        if (policy) {
            response = {
                success: false,
                message: "Une politique d'utilisation avec ce type existe déjà",
                data: policy
            }
            return res.status(responses.CONFLICT).json(response)
        }

        const newPolicy = await Policy.create({ ...req.body })
        response = {
            success: true,
            message: "Plitique d'utilisation ajouté !",
            data: newPolicy
        }

        return res.status(responses.CREATED).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

async function updatePolicyService(req, res) {

    try {

        const id = req.params.id
        const { type } = req.body

        const policy = await Policy.findByPk(id)

        let response = {}

        if (!policy) {
            response = {
                success: false,
                message: "Condition introuvable",
                data: policy
            }
            return res.status(responses.NOT_FOUND).json(response)
        }

        const existType = type && type !== policy.type
            && await Policy.findOne({ where: { type } })

        if (existType) {
            response = {
                success: false,
                message: "Une politique d'utilisation avec ce type existe déjà"
            }
            return res.status(responses.CONFLICT).json(response)
        }

        await policy.update({ ...req.body })

        response = {
            success: true,
            message: "Conditions mises à jour avec succès !",
            data: policy
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne est survenue",
            error: error.message
        })
    }

}

async function deletePolicyService(req, res) {

    try {

        const id = req.params.id
        const policy = await Policy.findByPk(id)

        let response
        if (!policy) {
            response = {
                success: false,
                message: "Condition introuvable",
                data: policy
            }

            return res.status(responses.NOT_FOUND).json(response)
        }

        await policy.destroy()

        response = {
            success: true,
            message: "Conditions supprimé avec succès",
            data: policy
        }

        return res.status(responses.OK).json(response)

    } catch (error) {
        console.log(`Erreur serveur: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Une erreur interne survenus",
            error: error.message
        })
    }

}

module.exports = {
    getAllPoliciesService,
    getOnePolicyService,
    addPolicyService,
    updatePolicyService,
    deletePolicyService
}
const bcrypt = require("bcrypt");
const User = require("../database/models/tables/users.model");
const CourierProfile = require("../database/models/tables/couriers.model");
const CourierPricing = require("../database/models/tables/pricing.model");
const Policy = require("../database/models/tables/policies.model");
const PolicyAcceptance = require("../database/models/tables/acceptancePolicy.model");
const Otp = require("../database/models/tables/otps.model");
require("../database/models/relations/relations.model"); // adapte le chemin vers ton fichier d'associations

async function seedDatabaseController(req, res) {

    try {

        // Nettoie les tables avant de reseeder (idempotent : appelable plusieurs fois)
        await PolicyAcceptance.destroy({ where: {}, truncate: true, cascade: true });
        await CourierPricing.destroy({ where: {}, truncate: true, cascade: true });
        await CourierProfile.destroy({ where: {}, truncate: true, cascade: true });
        await Otp.destroy({ where: {}, truncate: true, cascade: true });
        await Policy.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });

        const hashedPassword = await bcrypt.hash("Password123", 10);

        const usersData = [
            { firstname: "Kodjo", lastname: "Amegan", role: "courier", email: "kodjo.amegan@example.com", phone: "90000001", password: hashedPassword },
            { firstname: "Ama", lastname: "Kponou", role: "courier", email: "ama.kponou@example.com", phone: "90000002", password: hashedPassword },
            { firstname: "Yao", lastname: "Dogbe", role: "courier", email: "yao.dogbe@example.com", phone: "90000003", password: hashedPassword },
            { firstname: "Afi", lastname: "Tchalim", role: "courier", email: "afi.tchalim@example.com", phone: "90000004", password: hashedPassword },
            { firstname: "Kossi", lastname: "Bakonde", role: "courier", email: "kossi.bakonde@example.com", phone: "90000005", password: hashedPassword },
            { firstname: "Efoe", lastname: "Sodji", role: "courier", email: "efoe.sodji@example.com", phone: "90000006", password: hashedPassword },
            { firstname: "Mawuli", lastname: "Klutse", role: "supplier", email: "mawuli.klutse@example.com", phone: "90000007", password: hashedPassword },
            { firstname: "Sena", lastname: "Agbeko", role: "supplier", email: "sena.agbeko@example.com", phone: "90000008", password: hashedPassword },
            { firstname: "Edem", lastname: "Kutsu", role: "supplier", email: "edem.kutsu@example.com", phone: "90000009", password: hashedPassword },
            { firstname: "Selom", lastname: "Adjaho", role: "admin", email: "selom.adjaho@example.com", phone: "90000010", password: hashedPassword }
        ];

        const documentTypes = ["passeport", "identity_card", "residence_card"];
        const vehiculeTypes = ["car", "motorcycle", "tricycle", "bicycle"];

        const createdUsers = await User.bulkCreate(usersData, { returning: true });

        const couriers = createdUsers.filter(user => user.role === "courier");

        const courierProfilesData = couriers.map((courier, index) => ({
            userId: courier.id,

            documentType: documentTypes[index % documentTypes.length],
            documentNumber: `DOC-0000${index + 1}`,
            documentPhotoUrl: `https://example.com/document/${index + 1}.jpg`,
            selfiePhotoUrl: `https://example.com/selfie/${index + 1}.jpg`,

            vehiculeType: vehiculeTypes[index % vehiculeTypes.length],
            vehiculePhotoUrl: `https://example.com/vehicule/${index + 1}.jpg`,
            vehiculePlateNumber: `TG-${1000 + index}`,
            vehiculePlatePhotoUrl: `https://example.com/plate/${index + 1}.jpg`,
            vehiculeDescription: "Véhicule en bon état, couleur standard",
            drivingLicenseNumber: vehiculeTypes[index % vehiculeTypes.length] === "car" ? `PERMIS-000${index + 1}` : null,
            drivingLicensePhotoUrl: vehiculeTypes[index % vehiculeTypes.length] === "car" ? `https://example.com/permis/${index + 1}.jpg` : null,

            verificationStatus: "pending"
        }));

        await CourierProfile.bulkCreate(courierProfilesData);

        // ---------------- Politiques d'utilisation ----------------
        const policiesData = [
            {
                type: "generale",
                content: "Conditions générales d'utilisation de la plateforme Delivery. Le fournisseur et le livreur s'engagent à respecter les règles de la plateforme pour toute livraison effectuée.",
            },
            {
                type: "policy_pricing_per_minute",
                content: "Tarification à la minute : le livreur fixe un prix par minute de prestation. Ce tarif est affiché au fournisseur avant confirmation de la livraison.",
            },
            {
                type: "policy_pricing_per_km",
                content: "Tarification au kilomètre : le livreur fixe un prix par kilomètre parcouru. Le montant est calculé selon la distance estimée de la livraison.",
            },
            {
                type: "policy_pricing_negotiable",
                content: "Tarification négociable : le prix de la livraison est convenu directement entre le fournisseur et le livreur, sans barème imposé par la plateforme.",
            }
        ];

        const createdPolicies = await Policy.bulkCreate(policiesData, { returning: true });

        // ---------------- Tarifs des livreurs ----------------
        const pricingTypes = ["per_minute", "per_km", "negotiable"];

        const courierPricingsData = couriers.map((courier, index) => {
            const pricingType = pricingTypes[index % pricingTypes.length];
            return {
                userId: courier.id,
                pricingType,
                pricePerMinute: pricingType === "per_minute" ? 100 : null,
                pricePerKm: pricingType === "per_km" ? 250 : null,
                pricingTermsAcceptedAt: new Date()
            };
        });

        await CourierPricing.bulkCreate(courierPricingsData);

        // ---------------- Acceptation des politiques ----------------
        const policyAcceptancesData = [];

        // Chaque utilisateur accepte la politique générale
        const generalPolicy = createdPolicies.find(policy => policy.type === "generale");
        createdUsers.forEach(user => {
            policyAcceptancesData.push({
                userId: user.id,
                policyId: generalPolicy.id,
                acceptedAt: new Date()
            });
        });

        // Chaque livreur accepte la politique correspondant à son type de tarif
        const pricingPolicyByType = {
            per_minute: createdPolicies.find(policy => policy.type === "policy_pricing_per_minute"),
            per_km: createdPolicies.find(policy => policy.type === "policy_pricing_per_km"),
            negotiable: createdPolicies.find(policy => policy.type === "policy_pricing_negotiable")
        };

        couriers.forEach((courier, index) => {
            const pricingType = pricingTypes[index % pricingTypes.length];
            policyAcceptancesData.push({
                userId: courier.id,
                policyId: pricingPolicyByType[pricingType].id,
                acceptedAt: new Date()
            });
        });

        await PolicyAcceptance.bulkCreate(policyAcceptancesData);

        // ---------------- Codes OTP (exemples) ----------------
        const otpsData = [
            { sender: "90000001", source: "register", code: "482913", expiresAt: new Date(Date.now() - 60 * 60 * 1000), isUsed: true, attempts: 2 },
            { sender: "ama.kponou@example.com", source: "register", code: "175846", expiresAt: new Date(Date.now() - 30 * 60 * 1000), isUsed: true, attempts: 1 },
            { sender: "mawuli.klutse@example.com", source: "forgot-password", code: "739204", expiresAt: new Date(Date.now() + 10 * 60 * 1000), isUsed: false, attempts: 0 },
            { sender: "90000010", source: "reset-password", code: "604831", expiresAt: new Date(Date.now() + 5 * 60 * 1000), isUsed: false, attempts: 0 }
        ];

        await Otp.bulkCreate(otpsData);

        return res.status(200).json({
            success: true,
            message: "Base de données remplie avec succès",
            usersCreated: createdUsers.length,
            couriersCreated: courierProfilesData.length,
            policiesCreated: createdPolicies.length,
            pricingsCreated: courierPricingsData.length,
            acceptancesCreated: policyAcceptancesData.length,
            otpsCreated: otpsData.length
        });

    } catch (error) {
        console.log(`Erreur seeder: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Erreur lors du seeding",
            error: error.message
        });
    }

}

module.exports = { seedDatabaseController };
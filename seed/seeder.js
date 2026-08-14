const bcrypt = require("bcrypt");
const User = require("../database/models/tables/users.model");
const CourierProfile = require("../database/models/tables/couriers.model");
require("../database/models/relations/relations.model"); // adapte le chemin vers ton fichier d'associations

async function seedDatabaseController(req, res) {

    try {

        // Nettoie les tables avant de reseeder (idempotent : appelable plusieurs fois)
        await CourierProfile.destroy({ where: {}, truncate: true, cascade: true });
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

        const createdUsers = await User.bulkCreate(usersData, { returning: true });

        const couriers = createdUsers.filter(user => user.role === "courier");

        const vehicleTypes = ["car", "motorcycle", "tricycle", "bicycle"];

        const courierProfilesData = couriers.map((courier, index) => ({
            userId: courier.id,
            cniNumber: `CNI-0000${index + 1}`,
            cniPhotoUrl: `https://example.com/cni/${index + 1}.jpg`,
            selfiePhotoUrl: `https://example.com/selfie/${index + 1}.jpg`,
            vehicleType: vehicleTypes[index % vehicleTypes.length],
            vehiclePlateNumber: `TG-${1000 + index}`,
            vehiclePlatePhotoUrl: `https://example.com/plate/${index + 1}.jpg`,
            vehicleDescription: "Véhicule en bon état, couleur standard",
            drivingLicenseNumber: vehicleTypes[index % vehicleTypes.length] === "car" ? `PERMIS-000${index + 1}` : null,
            drivingLicensePhotoUrl: vehicleTypes[index % vehicleTypes.length] === "car" ? `https://example.com/permis/${index + 1}.jpg` : null,
            verificationStatus: "pending",
            status: "active"
        }));

        await CourierProfile.bulkCreate(courierProfilesData);

        return res.status(200).json({
            success: true,
            message: "Base de données remplie avec succès",
            usersCreated: createdUsers.length,
            couriersCreated: courierProfilesData.length
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
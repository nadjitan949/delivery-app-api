const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const CourierProfile = sequelize.define("CourierProfile",
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
        documentType: {type: DataTypes.ENUM("passeport", "identity_card", "residence_card"), allowNull: false,},
        documentNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        documentPhotoUrl: { type: DataTypes.STRING, allowNull: false },
        selfiePhotoUrl: { type: DataTypes.STRING, allowNull: false },

        vehiculeType: { type: DataTypes.ENUM("car", "motorcycle", "tricycle", "bicycle"), allowNull: false },
        vehiculePhotoUrl: {type: DataTypes.STRING, allowNull: false},
        vehiculePlateNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
        vehiculePlatePhotoUrl: { type: DataTypes.STRING, allowNull: true },
        vehiculeDescription: { type: DataTypes.TEXT, allowNull: false },
        drivingLicenseNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
        drivingLicensePhotoUrl: { type: DataTypes.STRING, allowNull: true },

        verificationStatus: { type: DataTypes.ENUM("pending", "under_review", "verified", "rejected"), defaultValue: "pending" },
        rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    },
    {
        tableName: "courier_profile",
        timestamps: true,
        paranoid: true,
         indexes: [
            {
                unique: true,
                fields: ["userId"],
                name: "courier_profile_user_id_unique"
            },
            {
                fields: ["verificationStatus"],
                name: "courier_profile_verification_status_idx"
            },
            {
                fields: ["vehiculeType"],
                name: "courier_profile_vehicule_type_idx"
            }
        ]
    }
 )

 module.exports = CourierProfile
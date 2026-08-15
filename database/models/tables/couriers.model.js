const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const CourierProfile = sequelize.define("CourierProfile",
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
        cniNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        cniPhotoUrl: { type: DataTypes.STRING, allowNull: false },
        selfiePhotoUrl: { type: DataTypes.STRING, allowNull: false },

        vehicleType: { type: DataTypes.ENUM("car", "motorcycle", "tricycle", "bicycle"), allowNull: false },
        vehiclePlateNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
        vehiclePlatePhotoUrl: { type: DataTypes.STRING, allowNull: true },
        vehicleDescription: { type: DataTypes.TEXT, allowNull: false },
        drivingLicenseNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
        drivingLicensePhotoUrl: { type: DataTypes.STRING, allowNull: true },

        verificationStatus: { type: DataTypes.ENUM("pending", "under_review", "verified", "rejected"), defaultValue: "pending" },
        rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    },
    {
        tableName: "courier_profile",
        timestamps: true,
        paranoid: true
    }
 )

 module.exports = CourierProfile
const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const CourierPricing = sequelize.define("CourierPricing",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
        pricingType: { type: DataTypes.ENUM("per_minute", "per_km", "negotiable"), allowNull: false, defaultValue: "negotiable" },
        pricePerMinute: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
        pricePerKm: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
        pricingTermsAcceptedAt: { type: DataTypes.DATE, allowNull: false }
    },
    {
        tableName: "courier_pricing",
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ["userId"],
                name: "pricing_user_idx"
            },
            {
                fields: ["pricingType"],
                name: "princing_courier_idx"
            }
        ]
    }
)

module.exports = CourierPricing
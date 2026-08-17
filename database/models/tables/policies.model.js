const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const Policy = sequelize.define("Policy",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
        type: {
            type: DataTypes.ENUM(
                "generale",
                "policy_pricing_per_minute",
                "policy_pricing_per_km",
                "policy_pricing_negotiable"),
            allowNull: false,
        },
        content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
        tableName: "policies",
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ["type"],
                name: "policies_type_idx"
            }
        ]
    }
)

module.exports = Policy
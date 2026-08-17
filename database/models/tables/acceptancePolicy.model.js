const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const PolicyAcceptance = sequelize.define("PolicyAcceptance",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        acceptedAt: { type: DataTypes.DATE, allowNull: false }
    },
    {
        tableName: "policy_acceptances",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["userId", "policyId"],
                name: "policy_acceptance_unique"
            }
        ]
    }
)

module.exports = PolicyAcceptance
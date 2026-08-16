const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const Policy = sequelize.define("Policy",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
        type: { type: DataTypes.ENUM("generale", "pricing"), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
        tableName: "policies",
        timestamps: true,
        paranoid: true
    }
)

module.exports = Policy
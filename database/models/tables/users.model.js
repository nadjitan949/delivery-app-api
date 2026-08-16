const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const User = sequelize.define("User", 
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM("supplier", "courier", "admin"), defaultValue: "supplier" },
        email: { type: DataTypes.STRING, allowNull: true, unique: true },
        phone: { type: DataTypes.STRING, allowNull: true, unique: true },
        password: { type: DataTypes.STRING },
        status: { type: DataTypes.ENUM("active", "banned", "suspended", "inactive"), defaultValue: "active" },
        reason: { type: DataTypes.TEXT }
    },
    {
        tableName: "users",
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ["role"],
                name: "users_role_idx"
            },
            {
                fields: ["status"],
                name: "users_status_idx"
            }
        ]
    }
)

module.exports = User
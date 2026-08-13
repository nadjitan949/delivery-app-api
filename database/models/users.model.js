const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db");

const User = sequelize.define("User", 
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM("supplier", "courier", "admin"), defaultValue: "supplier" },
        email: { type: DataTypes.STRING, allowNull: true, unique: true },
        phone: { type: DataTypes.STRING, allowNull: true, unique: true }
    },
    {
        tableName: "users",
        timestamps: true
    }
)

module.exports = User
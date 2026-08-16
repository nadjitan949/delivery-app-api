const { DataTypes } = require("sequelize");
const sequelize = require("../../connection/db");

const Otp = sequelize.define("Otp", 
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
        sender: { type: DataTypes.STRING, allowNull: false },
        source: { type: DataTypes.ENUM("register", "forgot-password", "reset-password"), allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false },
        expiresAt: { type: DataTypes.DATE, allowNull: false },
        isUsed: {type: DataTypes.BOOLEAN, defaultValue: false},
        attempts: { type: DataTypes.INTEGER, defaultValue: 0 }
    },
    {
        tableName: "otps",
        timestamps: true,
        indexes: [
            {
                fields: ["sender"],
                name: "otps_sender_idx"
            },
            {
                fields: ["sender", "source"],
                name: "otps_sender_source_idx"
            },
            {
                fields: ["expiresAt"],
                name: "otps_expires_at_idx"
            }
        ]
    }
)

module.exports = Otp
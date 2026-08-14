const CourierProfile = require("../tables/couriers.model");
const User = require("../tables/users.model");

CourierProfile.belongsTo(User, {foreignKey: "userId", onDelete: "CASCADE", as: "user"})
User.hasOne(CourierProfile, {foreignKey: "userId"})

module.exports = { CourierProfile, User }
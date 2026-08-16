const CourierProfile = require("../tables/couriers.model");
const CourierPricing = require("../tables/pricing.model");
const User = require("../tables/users.model");

CourierProfile.belongsTo(User, {foreignKey: "userId", onDelete: "CASCADE", as: "user"})
User.hasOne(CourierProfile, {foreignKey: "userId"})

CourierPricing.belongsTo(User, {foreignKey: "userId",  onDelete: "CASCADE", as: "pricing"})
User.hasOne(CourierPricing, { foreignKey: "userId" })

module.exports = { CourierProfile, User, CourierPricing }
const PolicyAcceptance = require("../tables/acceptancePolicy.model");
const CourierProfile = require("../tables/couriers.model");
const Policy = require("../tables/policies.model");
const CourierPricing = require("../tables/pricing.model");
const User = require("../tables/users.model");

CourierProfile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", as: "user" })
User.hasOne(CourierProfile, { foreignKey: "userId" })

CourierPricing.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", as: "user" })
User.hasOne(CourierPricing, { foreignKey: "userId" })

// Relation many-to-many : un utilisateur peut accepter plusieurs politiques,
// une politique peut être acceptée par plusieurs utilisateurs
User.belongsToMany(Policy, { through: PolicyAcceptance, foreignKey: "userId", otherKey: "policyId", as: "acceptedPolicies" })
Policy.belongsToMany(User, { through: PolicyAcceptance, foreignKey: "policyId", otherKey: "userId", as: "usersWhoAccepted" })

// Associations directes vers la table de jointure elle-même,
// utile pour accéder à "acceptedAt" sans passer par le many-to-many
PolicyAcceptance.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" })
PolicyAcceptance.belongsTo(Policy, { foreignKey: "policyId", onDelete: "CASCADE" })
User.hasMany(PolicyAcceptance, { foreignKey: "userId" })
Policy.hasMany(PolicyAcceptance, { foreignKey: "policyId" })

module.exports = { CourierProfile, User, CourierPricing, Policy, PolicyAcceptance }
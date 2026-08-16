const express = require("express")
const {
    getAllUsersController,
    getOneUserController,
    createUserController,
    updateUserController,
    resetUserPasswordController,
    deleteUserController,
    activeUserController,
    banUserController,
    suspendUserController,
    deactivateUserController
} = require("./user.controller")
const validate = require("../../middleware/validator/validate")
const {
    createUserSchema,
    updateUserSchema,
    resetUserPasswordSchema,
    banUserSchema,
    suspendUserSchema,
    deactiveUserSchema
} = require("./user.schema")

const userRoute = express.Router()

userRoute.get("/all", getAllUsersController)
userRoute.get("/details/:id", getOneUserController)

userRoute.post("/create", validate(createUserSchema), createUserController)

userRoute.put("/update/:id", validate(updateUserSchema), updateUserController)

userRoute.patch("/reset-password/:id", validate(resetUserPasswordSchema), resetUserPasswordController)
userRoute.patch("/activate/:id", activeUserController)
userRoute.patch("/ban/:id", validate(banUserSchema), banUserController)
userRoute.patch("/suspend/:id", validate(suspendUserSchema), suspendUserController)
userRoute.patch("/deactivate/:id", validate(deactiveUserSchema), deactivateUserController)

userRoute.delete("/delete/:id", deleteUserController)

module.exports = userRoute
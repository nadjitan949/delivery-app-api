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

const userRoute = express.Router()

userRoute.get("/all", getAllUsersController)
userRoute.get("/details/:id", getOneUserController)

userRoute.post("/create", createUserController)

userRoute.put("/update/:id", updateUserController)

userRoute.patch("/reset-password/:id", resetUserPasswordController)
userRoute.patch("/activate/:id", activeUserController)
userRoute.patch("/ban/:id", banUserController)
userRoute.patch("/suspend/:id", suspendUserController)
userRoute.patch("/deactivate/:id", deactivateUserController)

userRoute.delete("/delete/:id", deleteUserController)

module.exports = userRoute
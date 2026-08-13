const express = require("express")
const {
    getAllUsersController,
    createUserController,
    updateUserController,
    resetUserPasswordController,
    deleteUserController
} = require("./user.controller")
const { getOneUserService } = require("./user.service")

const userRoute = express.Router()

userRoute.get("/all", getAllUsersController)
userRoute.get("/details/:id", getOneUserService)

userRoute.post("/create", createUserController)

userRoute.put("/update/:id", updateUserController)

userRoute.patch("/reset-password/:id", resetUserPasswordController)

userRoute.delete("/delete/:id", deleteUserController)

module.exports = userRoute
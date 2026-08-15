const express = require("express")
const {
    completeCourierProfileController,
    underReviewProfileController,
    verifyProfileController,
    rejectProfileController,
    updateCourierProfileController,
    banCourierController,
    activateCourierController,
    suspendCourierController,
    deactivateCourierController
} = require("./courier.controller")

const courierRoute = express.Router()

courierRoute.post("/complete-profile", completeCourierProfileController)

courierRoute.put("/update-profile", updateCourierProfileController)

courierRoute.patch("/under-review/:id", underReviewProfileController)
courierRoute.patch("/verify/:id", verifyProfileController)
courierRoute.patch("reject/:id", rejectProfileController)

module.exports = courierRoute
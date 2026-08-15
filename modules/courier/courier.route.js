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
const validate = require("../../middleware/validate")
const {
    completeCourierProfileSchema,
    updateCourierProfileSchema,
    rejectProfileSchema
} = require("./courier.schema")

const courierRoute = express.Router()

courierRoute.post("/complete-profile", validate(completeCourierProfileSchema), completeCourierProfileController)

courierRoute.put("/update-profile", validate(updateCourierProfileSchema), updateCourierProfileController)

courierRoute.patch("/under-review/:id", underReviewProfileController)
courierRoute.patch("/verify/:id", verifyProfileController)
courierRoute.patch("reject/:id", validate(rejectProfileSchema), rejectProfileController)

module.exports = courierRoute
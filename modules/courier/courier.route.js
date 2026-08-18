const express = require("express")
const {
    completeCourierProfileController,
    underReviewProfileController,
    verifyProfileController,
    rejectProfileController,
    updateCourierProfileController,
} = require("./courier.controller")
const validate = require("../../middleware/validator/validate")
const {
    completeCourierProfileSchema,
    updateCourierProfileSchema,
    rejectProfileSchema
} = require("./courier.schema")
const { courierPhotosUpload } = require("../../middleware/multer/upload")
const uploadCourierPhotos = require("../../middleware/multer/upload.middleware")

const courierRoute = express.Router()

courierRoute.post(
    "/complete-profile",
    courierPhotosUpload,
    uploadCourierPhotos,
    validate(completeCourierProfileSchema),
    completeCourierProfileController
)

courierRoute.put(
    "/update-profile/:id",
    courierPhotosUpload,
    uploadCourierPhotos,
    validate(updateCourierProfileSchema),
    updateCourierProfileController
)

courierRoute.patch("/under-review/:id", underReviewProfileController)
courierRoute.patch("/verify/:id", verifyProfileController)
courierRoute.patch("/reject/:id", validate(rejectProfileSchema), rejectProfileController)

module.exports = courierRoute
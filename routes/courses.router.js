const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");
const { validitionSchema } = require("../middlewares/validitionSchema");
const verifyToken = require("../middlewares/verfiyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");
router
    .route("/")
    .get(verifyToken,coursesController.getAllcourses)
    .post(validitionSchema(), coursesController.addCourse);
router
    .route("/:courseId")
    .get(coursesController.getCourse)
    .patch(coursesController.updateCourse)
    .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),coursesController.deleteCourse);

module.exports = router;

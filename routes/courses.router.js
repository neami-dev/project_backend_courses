const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");
const { validitionSchema } = require("../middlewares/validitionSchema");

router
    .route("/")
    .get(coursesController.getAllcourses)
    .post(validitionSchema(), coursesController.addCourse);
router
    .route("/:courseId")
    .get(coursesController.getCourse)
    .patch(coursesController.updateCourse)
    .delete(coursesController.deleteCourse);

module.exports = router;

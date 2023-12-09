const { validationResult } = require("express-validator");
const Course = require("../models/courses.modul");

const getAllcourses = async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
};
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ msj: "course not found !" });
        }
        res.status(200).json(course);
    } catch (err) {
        return res.status(400).json({ msj: "invalid opject ID !" });
    }
};
const addCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
};
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.updateOne(
            { _id: courseId },
            { $set: { ...req.body } }
        );
        res.status(200).json(course);
        if (!course) {
            return res.status(404).json({ msj: "course not found !" });
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const deleteCourse = await Course.deleteOne({ _id: courseId });
        res.status(200).json(deleteCourse);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

module.exports = {
    getAllcourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
};

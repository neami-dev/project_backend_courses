const { validationResult } = require("express-validator");
const Course = require("../models/courses.modul");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllcourses = asyncWrapper(async (req, res) => {
    const query  = req.query;
    const limit = +query.limit || 6;
    const page =  +query.page || 1;
     
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { __v: 0 }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});
const getCourse = asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
        const error = appError.create(
            " not found course ",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    return res
        .status(200)
        .json({ status: httpStatusText.SUCCESS, data: { course } });
});
const addCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
    }
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { course: newCourse },
    });
});
const updateCourse = asyncWrapper(async (req, res,next) => {
    const courseId = req.params.courseId;
   const course= await Course.findById({ _id: courseId })
   if(!course){
    const error = appError.create("course not found",404,httpStatusText.FAIL)
    return next(error);
   }
    const udateCourse = await Course.updateOne(
        { _id: courseId },
        { $set: { ...req.body } }
    );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { course: udateCourse },
    });
});
const deleteCourse = asyncWrapper(async (req, res,next) => {
    const courseId = req.params.courseId;
    const deleteCourse = await Course.findByIdAndDelete({ _id: courseId });
     if(!deleteCourse){
        const error = appError.create("course not found", 404, httpStatusText.FAIL);
        return next(error);
     }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
    getAllcourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
};

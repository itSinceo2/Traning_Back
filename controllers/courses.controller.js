const Course = require('../models/Course.model');
const User = require('../models/User.model');
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

module.exports.getAll = (req, res, next) => {
    Course.find()
        .then(courses => {
            res.status(StatusCodes.OK).json(courses);
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.create = (req, res, next) => {
    if(req.file){
        req.body.image = req.file.path;
    }
    
    const course = new Course(req.body);
    course.save()
        .then(course => {
            res.status(StatusCodes.CREATED).json(course);
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.getOne = (req, res, next) => {
    Course.findById(req.params.id)
      .then((course) => {
        if (!course) {
          next(createError(StatusCodes.NOT_FOUND, "Course not found"));
        } else {
          res.status(StatusCodes.OK).json(course);
        }
      })
      .catch((err) => {
        console.log(err);
        next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
    });
}

module.exports.update = (req, res, next) => {
    if(req.file){
        req.body.image = req.file.path;
    }
    const id = req.params.id;
    const course = req.body;

    Course.findByIdAndUpdate(id, course, { new: true })
        .then(course => {
            if(!course){
                next(createError(StatusCodes.NOT_FOUND, "Course not found"));
            } else {
                res.status(StatusCodes.OK).json(course);
            }
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.delete = (req, res, next) => {
    const id = req.params.id;
    Course.findByIdAndDelete(id)
        .then(course => {
            if(!course){
                next(createError(StatusCodes.NOT_FOUND, "Course not found"));
            } else {
                res.status(StatusCodes.NO_CONTENT).json();
            }
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}
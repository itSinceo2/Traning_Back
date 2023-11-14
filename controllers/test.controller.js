const mongoose = require('mongoose');
const createError = require('http-errors');
const Test = require('../models/Test.model');
const User = require('../models/User.model');
const Course = require('../models/Course.model');

module.exports.create = (req, res, next) => {
    const { questions, course, score } = req.body;
    const test = new Test({
        questions,
        course,
        score
    });
    test.save()
        .then(test => res.status(201).json(test))
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}

module.exports.getAll = (req, res, next) => {
    Test.find()
        .populate('course')
        .then(tests => res.status(200).json(tests))
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}

module.exports.getOne = (req, res, next) => {
    Test.findById(req.params.id)
        .populate('course')
        .then(test => {
            if (!test) {
                throw createError(404, 'Test not found');
            } else {
                res.status(200).json(test);
            }
        })
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}

module.exports.update = (req, res, next) => {
    const id = req.params.id;
    const { questions, course, score } = req.body;
    Test.findByIdAndUpdate(id, { questions, course, score }, { new: true })
        .then(test => {
            if (!test) {
                throw createError(404, 'Test not found');
            } else {
                res.status(200).json(test);
            }
        })
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}

module.exports.delete = (req, res, next) => {
    Test.findByIdAndDelete(req.params.id)
        .then(test => {
            if (!test) {
                throw createError(404, 'Test not found');
            } else {
                res.status(204).json();
            }
        })
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}

module.exports.getTestsByCourse = (req, res, next) => {
    Test.find({ course: req.params.id })
        .populate('user')
        .populate('course')
        .then(tests => {
            if (!tests) {
                throw createError(404, 'Tests not found');
            } else {
                res.status(200).json(tests);
            }
        })
        .catch((err) =>{
            console.log(err)
            next(createError(400, err))
        })
}
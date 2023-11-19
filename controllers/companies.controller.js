const Company = require('../models/Company.model');
const User = require('../models/User.model');
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

module.exports.getAll = (req, res, next) => {
    Company.find()
    .populate('users')
    .populate('courses')
        .then(companys => {
            res.status(StatusCodes.OK).json(companys);
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.create = (req, res, next) => {
    if(req.file){
        req.body.logo = req.file.path;
    }
    
    const company = new Company(req.body);
    company.save()
        .then(company => {
            res.status(StatusCodes.CREATED).json(company);
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.getOne = (req, res, next) => {
    Company.findById(req.params.id)
    .populate('users')
    .populate('courses')
      .then((company) => {
        if (!company) {
          next(createError(StatusCodes.NOT_FOUND, "Company not found"));
        } else {
          res.status(StatusCodes.OK).json(company);
        }
      })
      .catch((err) => {
        console.log(err);
        next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
    });
}

module.exports.update = (req, res, next) => {
    if(req.file){
        req.body.logo = req.file.path;
    }
    const id = req.params.id;
    const company = req.body;

    Company.findByIdAndUpdate(id, company, { new: true })
        .then(company => {
            if(!company){
                next(createError(StatusCodes.NOT_FOUND, "Company not found"));
            } else {
                res.status(StatusCodes.OK).json(company);
            }
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

module.exports.delete = (req, res, next) => {
    Company.findByIdAndDelete(req.params.id)
        .then((company) => {
            if (!company) {
                next(createError(StatusCodes.NOT_FOUND, "Company not found"));
            } else {
                res.status(StatusCodes.OK).json(company);
            }
        })
        .catch((err) => {
            console.log(err);
            next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        });
}

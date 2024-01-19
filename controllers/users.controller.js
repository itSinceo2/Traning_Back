//User controller
const User = require('../models/User.model');
const { StatusCodes } = require('http-status-codes');
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports.register = (req, res, next) => {
    if (req.file) {
        req.body.avatar = req.file.path;
    }

    const user = new User(req.body);
    user.save()
        .then(user => {
            res.status(StatusCodes.CREATED).json(user);
        })
        .catch((err) => console.log(err));
}

module.exports.login = (req, res, next) => {
    const loginError = () => next(createError(StatusCodes.UNAUTHORIZED, "Invalid email or password"));
    const { email, password } = req.body;

    if (!email || !password) {
        return next(loginError());
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                next(loginError());
            } else {
                return user.checkPassword(password)
                    .then(match => {
                        if (!match) {
                            next(loginError());
                        } else {
                            res.json({
                                access_token: jwt.sign(
                                    { id: user._id },
                                    process.env.JWT_SECRET || "Super secret",
                                    { expiresIn: process.env.JWT_EXPIRES_IN }
                                )
                            });
                        }
                    });
            }
        })
        .catch(next);
}

module.exports.getOne = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                next(createHttpError(StatusCodes.NOT_FOUND, "User not found"));
            } else {
                res.status(StatusCodes.OK).json(user);
            }
        })
        .catch(next);
};

module.exports.list = (req, res, next) => {
    //lista de usuarios populando la propiedad company
    User.find()
        .populate("company")
        .populate("courses.course")
        .then(users => {
            res.json(users);
        })
        .catch(next);
}

module.exports.update = (req, res, next) => {
    const { id } = req.params;
    if (req.file) {
        req.body.avatar = req.file.path;
    }
    console.log(req.body);
    User.findByIdAndUpdate(id, req.body, { new: true })
        .then(user => {
            if (!user) {
                next(createError(StatusCodes.NOT_FOUND, "User not found"));
            } else {
                res.json(user);
            }
        })
        .catch((error) => {
            console.log("error: " + error);
            next(error);
        });
}

module.exports.delete = (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then(user => {
            if (!user) {
                next(createError(StatusCodes.NOT_FOUND, "User not found"));
            } else {
                res.status(StatusCodes.NO_CONTENT).json();
            }
        })
        .catch(next);
}

module.exports.getCurrentUser = (req, res, next) => {

    User.findById(req.currentUser)
        .populate("company")
        .populate("courses.course")
        .then(user => {
            if (!user) {
                next(createError(StatusCodes.NOT_FOUND, "User not found"));
            } else {
                res.json(user);
            }
        })
        .catch((error) => {
            console.log("error: " + error);
            next(error);
        });
}

//actualizar el testResults del usuario

module.exports.updateTestResults = async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        const { id } = req.params;
        const { testsResults } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return next(createError(StatusCodes.NOT_FOUND, "User not found"));
        }

        const courseTest = user.courses.find(course => {
            const userId = course.course._id.toString();
            return (userId === testsResults.courseId)
        });

        if (!courseTest) {
            return next(createError(StatusCodes.NOT_FOUND, "Course not found"));
        }

        if (!testsResults.testId) {
            courseTest.testsResults = testsResults;
            await user.save();
        } else {
            courseTest.testsResults.push(testsResults);
            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};


module.exports.updateCourseTime = async (req, res, next) => {
    try {
        const { courseId, dedication } = req.body;
        const { id } = req.params;
        console.log(`id: ${id}`);
        console.log( req.body);

        const user = await User.findById(id);

        if (!user) {
            console.log("user not found");
            return next(createError(StatusCodes.NOT_FOUND, "User not found"));
        }

       
        const courseIndex = user.courses.findIndex(course => course.course._id.toString() === courseId);
        console.log(`courseIndex: ${courseIndex}`);

        if (courseIndex === -1) {
            return next(createError(StatusCodes.NOT_FOUND, "Course not found"));
        }

        user.courses[courseIndex].dedication = dedication;
        await user.save();

        console.log("user", user);

        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};

  


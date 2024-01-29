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
    console.log('entrando en login')
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
        .populate("courses.course")
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



        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};


//updateCourseProgress
module.exports.updateCourseProgress = async (req, res, next) => {
    console.log(req.body)
    try {
        const { courseId } = req.body;
        const { id } = req.params;
        const progress = {
            courseLength: req.body.courseLength,
            courseProgress: req.body.courseProgress,
            courseProgressPercent: req.body.courseProgressPercent
        }

        const user = await User.findById(id);

        if (!user) {
            return next(createError(StatusCodes.NOT_FOUND, "User not found"));
        }

        const courseIndex = user.courses.findIndex(course => course.course._id.toString() === courseId);

        if (courseIndex === -1) {
            return next(createError(StatusCodes.NOT_FOUND, "Course not found"));
        }

        // Actualizar el campo progress en el array courses
        user.courses[courseIndex].progress = {
            courseLength: progress.courseLength,
            courseProgress: progress.courseProgress,
            courseProgressPercent: progress.courseProgressPercent
        };

        await user.save();
        console.log("user", user.courses[courseIndex].progress);

        res.json(user);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};

//Agregando o quitando cursos a la lista de cursos del usuario
module.exports.updateCourseStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { coursesId } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return next(createError(StatusCodes.NOT_FOUND, "User not found"));
        }

        // Filtrar cursos existentes del usuario que no están en coursesId
        const updatedCourses = user.courses.filter(course => coursesId.includes(course.course.toString()));

        // Añadir nuevos cursos de coursesId al usuario
        const newCourses = coursesId
            .filter(courseId => !user.courses.some(course => course.course.toString() === courseId))
            .map(courseId => ({ course: courseId }));

        user.courses = [...updatedCourses, ...newCourses];

        await user.save();

        res.status(StatusCodes.OK).json({ message: "User courses updated successfully", user });
    } catch (error) {
        next(error);
    }
};


module.exports.updateExamResults = (req, res) => {
    const { courseId, userId, examResults } = req.body;
    console.log('Entraaaaaaaaaaaaaaaaaaaaaaaaaaa')

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const courseIndex = user.courses.findIndex(course => course.course.toString() === courseId);

            if (courseIndex === -1) {
                return res.status(404).json({ message: 'Curso no encontrado para este usuario' });
            }

            user.courses[courseIndex].examResults = examResults;

            console.log('user.courses[courseIndex].examResults');

            console.log(user)
            return user.save();
        })
        .then(updatedUser => {
            res.status(200).json({ message: 'Resultados del examen actualizados exitosamente', user: updatedUser });
        })
        .catch(error => {
            console.error('Error al actualizar resultados del examen:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        });
};


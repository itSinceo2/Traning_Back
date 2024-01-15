const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { Schema, model } = mongoose;
const ROLES = ['Administrador SinCeO2','Administrador', 'Usuario'];

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.']
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            trim: true
        },
        role: {
            type: String,
            enum: ROLES,
            default: 'user'
        },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/dv7hswrot/image/upload/v1606988059/avatar/avatar_cugq40.png'
        },
        active: {
            type: Boolean,
            default: false
        },
        activationToken: {
            type: String,
            default: () => {
                return (
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
                );
            }
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        },
        courses: [{
            course: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                default: null
            },
            status: {
                type: String,
                enum: ['enrolled', 'completed', 'pending'],
                default: 'pending'
            },
            progress: {
                type: Number,
                default: 0
            },
            testsResults: [{
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course'
                },
                responses: [{
                    question: String, // Puedes cambiar esto a ObjectId si lo prefieres
                    response: String // Puedes cambiar esto a ObjectId si lo prefieres
                }],
                score: {
                    type: Number,
                    default: 0
                },
                testId: {
                    type: String,
                },
            }],
            examResults: [{
                type: Schema.Types.ObjectId,
                ref: 'ExamResult'
            }],
            dedication: {
                type: Number,
                default: 0
            },
            startDate: {
                type: Date,
                default: Date.now
            }
        }],
    },
    {
        timestamps: true,
        toJSON : {
            transform: (doc, ret) => {
                ret.id = doc._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            }
        }
    }
);

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    } else {
        bcrypt
            .genSalt(SALT_WORK_FACTOR)
            .then(salt => {
                return bcrypt.hash(user.password, salt).then(hash => {
                    user.password = hash;
                    next();
                });
            })
            .catch(error => next(error));
    }
});

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}

const User = model('User', userSchema);
module.exports = User;


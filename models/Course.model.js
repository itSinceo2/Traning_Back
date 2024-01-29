//modelo de cursos

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    mainImage: {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dv7hswrot/image/upload/v1606988059/avatar/avatar_cugq40.png'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    content: [{
        title: {
            type: String,
            trim: true
        },
        description: {
            type: String,

            trim: true
        },
        image: {
            type: String,
            trim: true
        }
    }],
    tests: [{
        title: {
            type: String,
            trim: true
        },
        questions: [{
            question: {
                type: String,
                trim: true
            },
            options: [{
                option: {
                    type: String,
                    trim: true
                },
                isCorrect: {
                    type: Boolean,
                    default: false
                }
            }]
        }]
    }],
    Exam: {
        title: {
            type: String,
            trim: true
        },
        questions: [{
            question: {
                type: String,
                trim: true
            },
            options: [{
                option: {
                    type: String,
                    trim: true
                },
                isCorrect: {
                    type: Boolean,
                    default: false
                }
            }]
        }]
    },

}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
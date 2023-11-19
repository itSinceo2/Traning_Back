const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logoPattern = /^https?:\/\//i;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: 'https://static.thenounproject.com/png/638636-200.png'
    },
    nif: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true,
    toJSON:
    {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
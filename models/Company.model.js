const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: 'https://res.cloudinary.com/dv7hswrot/image/upload/v1606988059/avatar/avatar_cugq40.png'
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
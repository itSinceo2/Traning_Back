//test model relacionado con el modelo usuario y curso
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    questions: [{
        Number: Number,
        question: String,
        answer: String,
        options: [String],
        points: Number
    }],
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
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
const Test = mongoose.model('Test', testSchema);
module.exports = Test;




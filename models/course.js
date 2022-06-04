const { Schema } = require('mongoose');

const courseSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true
    },
    instructorId: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});
exports.courseSchema = courseSchema;

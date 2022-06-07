const { Schema, mongoose } = require('mongoose');

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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
});
exports.courseSchema = courseSchema;

const Course = mongoose.model('Course', courseSchema)
exports.Course = Course

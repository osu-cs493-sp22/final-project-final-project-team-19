const { Schema, mongoose } = require('mongoose');

const assignmentSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    due: {
        type: String, // may consider changing to a date type (also native)
        required: true
    }
});
exports.assignmentSchema = assignmentSchema;

const Assignment = mongoose.model('Assignment', assignmentSchema);
exports.Assignment = Assignment;

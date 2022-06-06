const { Schema, mongoose } = require('mongoose');

const assignmentSchema = new Schema({
    courseId: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }
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

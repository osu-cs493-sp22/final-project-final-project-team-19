const { Schema, mongoose } = require('mongoose');

const submissionSchema = new Schema({
    assignmentId: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Assignment'
        }
    },
    studentId: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        required: true
    },
    grade: {
        type: Number,
        default: -1
    },
    submittedTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    fileName: {
        type: String,
        required: true
    },
    file: {
        data: Buffer,
        contentType: String,
        required: true
    }
});
exports.submissionSchema = submissionSchema;

const Submission = mongoose.model('Submission', submissionSchema);
exports.Submission = Submission;

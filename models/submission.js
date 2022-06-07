const { Schema, mongoose } = require("mongoose");

const submissionSchema = new Schema({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    grade: {
        type: Number,
        default: -1,
    },
    submittedTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    fileName: {
        type: String,
        required: true,
    },
    file: {
        data: Buffer,
        contentType: String,
    },
});
exports.submissionSchema = submissionSchema;

const Submission = mongoose.model("Submission", submissionSchema);
exports.Submission = Submission;

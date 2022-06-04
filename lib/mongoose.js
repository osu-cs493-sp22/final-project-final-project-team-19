const mongoose = require('mongoose');

const db_user = process.env.DB_USERNAME || 'root';
const db_pass = process.env.DB_PASSWORD || 'hunter2';
const db_host = process.env.DB_HOSTNAME || 'localhost';
const db_port = process.env.DB_PORT || 27017;

console.log(`=== Connecting to mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`);

mongoose.set('debug', true);
exports.connect = (callback) => {
    mongoose.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`)
        .then(() => {
            console.log("Connected to db")
            callback();
        })
        .catch((err) => {
            console.log(`Failed to connect to DB with error: ${err}`)
            throw err;
        })
}

const { userSchema } = require("../models/user");
const { courseSchema } = require("../models/course");
const { assignmentSchema } = require("../models/assignment");

exports.schema = {
    user: userSchema,
    course: courseSchema,
    assignment: assignmentSchema
}

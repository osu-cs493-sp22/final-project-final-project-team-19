const { connect } = require('./lib/mongoose')
const { User } = require('./models/user')
const { Course } = require('./models/course')
const { Assignment } = require('./models/assignment')

const userData = require('./data/users.json')
const courseData = require('./data/courses.json')
const assignmentData = require('./data/assignments.json')

const mongoCreateUser = process.env.MONGO_CREATE_USER
const mongoCreatePassword = process.env.MONGO_CREATE_PASSWORD

function onInsert(err, docs) {
    if (err) {
        console.error("Items not added successfully")
        console.error(err)
    } else {
        console.log(`${docs.length} items were successfully stored.`)
    }
}

connect( async () => {
    console.log("=== Adding users")
    await User.insertMany(userData, onInsert)

    console.log("=== Adding Courses")
    await Course.insertMany(courseData, onInsert)

    console.log("=== Adding Assignments")
    await Assignment.insertMany(assignmentData, onInsert)

})
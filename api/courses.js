const { Router } = require('express')

const router = Router()

// Fetch the list of all Courses
/* 
 * Returns the list of all Courses. This list should be
 * paginated. The Courses returned should not contain the list
 * of students in the Course or the list of Assignments for the
 * Course.
*/ 
router.get("/", (req, res, next) => {
    // TODO: Implement
})

// Create a new course
/*
 * Creates a new Course with specified data and adds it to the 
 * application's database. Only an authenticated User with
 * 'admin' role can create a new Course.
 */
router.post("/", (req, res, next) => {
    // TODO: Implement
})

// Fetch data about a specific course
/*
 * Returns summary data about the Course, excluding the list of
 * students enrolled in the course and the list of Assignments
 * for the course.
 */
router.get("/:courseId", (req, res, next) => {
    // TODO: Implement
})

// Update data for a specific Course.
/* 
 * Performs a partial update on the data for the Course. Note 
 * that enrolled students and assignments cannot be modified
 * via this endpoint. Only an authenticated User with 'admin'
 * role or an authenticated 'instructor' User whose ID matches
 * the instructorId of the Course can update Course information.
 */
router.patch("/:courseId", (req, res, next) => { 
    // TODO: Implement
})

// Remove a specific Course from the database.
/*
 * Completely removes the data for the specified Course,
 * including all enrolled students, all Assignments, etc. Only
 * an authenticated User with 'admin' role can remove a Course.
 */
router.delete("/:courseId", (req, res, next) => {
    // TODO: Implement
})

// Fetch a list of the students enrolled in the Course.
/*
 * Returns a list containing the User IDs of all students 
 * currently enrolled in the Course. Only an authenticated User
 * with 'admin' role or an authenticated 'instructor' User whose
 * ID matches the instructorId of the Course can fetch the list
 * of enrolled students.
 */
router.get("/:courseId/students", (req, res, next) => {
    // TODO: Implement
})

// Update enrollment for a Course.
/* 
 * Enrolls and/or unenrolls students from a Course. Only an 
 * authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the
 * Course can update the students enrolled in the Course.
 */
router.post("/:courseId/students", (req, res, next) => {
    // TODO: Implement
})

// Fetch a CSV file containing list of the students enrolled in the Course.
/*
 * Returns a CSV file containing information about all of the 
 * students currently enrolled in the Course, including names,
 * IDs, and email addresses. Only an authenticated User with 
 * 'admin' role or an authenticated 'instructor' User whose ID
 * matches the instructorId of the Course can fetch the course
 * roster.
 */
router.get("/:courseId/roster", (req, res, next) => {
    // TODO: Implement
})

// Fetch a list of the Assignments for the Course.
/*
 * Returns a list containing the Assignment IDs of all 
 * Assignments for the Course.
 */
router.get("/:courseId/assignments", (req, res, next) => {
    // TODO: Implement
})

module.exports = router
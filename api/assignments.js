const { Router } = require('express')

const router = Router()

// Create a new Assignment
/*
 * Create and store a new Assignment with specified data and 
 * adds it to the application's database. Only an 
 * authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the
 * Course corresponding to the Assignment's courseId can create
 * an Assignment.
 */
router.post("/", (req, res, next) => {
    // TODO: Implement
})

// Fetch data about a specific Assignment
/*
 * Returns summary data about the Assignment, excluding the list
 * of Submissions.
 */
router.get("/:assignmentId", (req, res, next) => {
    // TODO: Implement
})

// Update data for a specific Assignment
/*
 * Performs a partial update on the data for the Assignment.
 * Note that submissions cannot be modified via this endpoint.
 * Only an authenticated User with 'admin' role or an 
 * authenticated 'instructor' User whose ID matches the
 * instructorId of the Course corresponding to the Assignment's
 * courseId can update an Assignment.
 */
router.patch("/:assignmentId", (req, res, next) => {
    // TODO: Implement
})

// Remove a specific Assignment from the database.
/*
 * Completely removes the data for the specified Assignment, 
 * including all submissions. Only an authenticated User with
 * 'admin' role or an authenticated 'instructor' User whose ID
 * matches the instructorId of the Course corresponding to the
 * Assignment's courseId can delete an Assignment.
 */
router.delete("/:assignmentId", (req, res, next) => {
    // TODO: Implement
})

// Fetch a list of the Assignments for a specific Course.
/*
 * Returns the list of all Submissions for an Assignment. This
 * list should be paginated. Only an authenticated User with 
 * 'admin' role or an authenticated 'instructor' User whose ID
 * matches the instructorId of the Course corresponding to the
 * Assignment's courseId can fetch the Submissions for an 
 * Assignment.
 */
router.get("/:assignmentId/submissions", (req, res, next) => {
    // TODO: Implement
})

// Create a new Submission for an Assignment.
/*
 * Create and store a new Assignment with specified data and 
 * adds it to the application's database. Only an authenticated 
 * User with 'student' role who is enrolled in the Course 
 * corresponding to the Assignment's courseId can create a 
 * Submission.
 */
router.post("/:assignmentId/submissions", (req, res, next) => {
    // TODO: Implement
})

module.exports = router

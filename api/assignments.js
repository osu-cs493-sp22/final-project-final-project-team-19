const { Router } = require('express')
const { requireAuthentication } = require('../lib/auth')
const { Assignment } = require('../models/assignment')
const { Course } = require('../models/course')
const { User } = require('../models/user')


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
router.post("/", requireAuthentication , async (req, res, next) => {
    if (req.body.courseId.length == 24) {
        const course = await Course.findById(req.body.courseId)
        if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
            const newAssignment = new Assignment(req.body)
            let error = newAssignment.validateSync()

            if (!error) {
                const assignments = await Assignment.find({
                    title: newAssignment.title,
                    points: newAssignment.points,
                    due: newAssignment.due,
                    courseId: newAssignment.courseId
                })

                if (assignments.length <= 0) {
                    await newAssignment.save()
                    res.status(201).send({
                        id: newAssignment._id
                    })
                } else {
                    res.status(400).send({
                        error: "A duplicate assignment already exists"
                    })
                }
            } else {
                res.status(400).send({
                    error: "The request body was either not present or did not contain a valid Assignment object."
                })
            }
        } else {
            res.status(403).send({
                error: "You are not an authorized user to access this resource"
            })
        }
    } else {
        next()
    }
})

// Fetch data about a specific Assignment
/*
 * Returns summary data about the Assignment, excluding the list
 * of Submissions.
 */
router.get("/:assignmentId", async (req, res, next) => {
    if (req.params.assignmentId.length == 24) {
        const assignment = await Assignment.findOne({ _id: req.params.assignmentId }).select('title points due courseId')

        if (assignment) {
            res.status(200).send(assignment)
        } else {
            next()
        }
    } else {
        next()
    }
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
router.patch("/:assignmentId", requireAuthentication, async (req, res, next) => {
    if (req.params.assignmentId.length == 24 && req.body.courseId.length == 24) {
        const course = await Course.findById(req.body.courseId)
        const assignment = await Assignment.findById(req.params.assignmentId)
        if (course && assignment) {
            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                const updatedAssignment = new Assignment(req.body)
                let error = updatedAssignment.validateSync() 

                if (!error) {
                    const assignments = await Assignment.find({
                        title: updatedAssignment.title,
                        points: updatedAssignment.points,
                        due: updatedAssignment.due,
                        courseId: updatedAssignment.courseId
                    })
                    if (assignments.length == 0) {
                        await Assignment.findByIdAndUpdate(req.params.assignmentId, 
                            { 
                                title: updatedAssignment.title,
                                points: updatedAssignment.points,
                                due: updatedAssignment.due,
                                courseId: updatedAssignment.courseId
                            })
                        res.status(200).send()
                    } else {
                        res.status(400).send({
                            error: "A duplicate assignment with these details already exists"
                        })
                    }
                } else {
                    res.status(400).send({
                        error: "The request body must contain a valid Assignment object"
                    })
                }
            } else {
                res.status(403).send({
                    error: "You are not authorized to modify this resource"
                })
            }
        } else {
            next()
        }
    } else {
        next()
    }
})

// Remove a specific Assignment from the database.
/*
 * Completely removes the data for the specified Assignment, 
 * including all submissions. Only an authenticated User with
 * 'admin' role or an authenticated 'instructor' User whose ID
 * matches the instructorId of the Course corresponding to the
 * Assignment's courseId can delete an Assignment.
 */
router.delete("/:assignmentId", requireAuthentication, async (req, res, next) => {
    if (req.params.assignmentId.length == 24) {
        const assignment = await Assignment.findById(req.params.assignmentId)

        if (assignment) {
            const courseId = assignment.courseId
            const course = await Course.findById(courseId)

            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                await Assignment.findByIdAndRemove(req.params.assignmentId)
                res.status(204).send()
            } else {
                res.status(403).send({
                    error: "You are not authorized to modify this resource"
                })
            }
        } else {
            next()
        }
    } else {
        next()
    }
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

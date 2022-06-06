const { Router } = require('express')
const { requireAuthentication } = require('../lib/auth')
const { Course } = require('../models/course')
const { User } = require('../models/user')

const router = Router()

// Fetch the list of all Courses
/* 
 * Returns the list of all Courses. This list should be
 * paginated. The Courses returned should not contain the list
 * of students in the Course or the list of Assignments for the
 * Course.
*/ 
router.get("/", async (req, res, next) => {
    const courses = await Course.find().select('subject number title term instructorId')

    let page = parseInt(req.query.page) || 1;
    const numPerPage = 10;
    const lastPage = Math.ceil(courses.length / numPerPage);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;

    const start = (page - 1) * numPerPage;
    const end = start + numPerPage;
    const pageCourses = courses.slice(start, end);

    const links = {};
    if (page < lastPage) {
      links.nextPage = `/courses?page=${page + 1}`;
      links.lastPage = `/courses?page=${lastPage}`;
    }
    if (page > 1) {
      links.prevPage = `/courses?page=${page - 1}`;
      links.firstPage = '/courses?page=1';
    }

    res.status(200).json({
        courses: pageCourses,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: courses.length,
        links: links
    });
})

// Create a new course
/*
 * Creates a new Course with specified data and adds it to the 
 * application's database. Only an authenticated User with
 * 'admin' role can create a new Course.
 */
router.post("/", requireAuthentication, async (req, res, next) => {
    if(req.user.role == 'admin') {
        const newCourse = new Course(req.body)
        let error = newCourse.validateSync();

        if(!error) {
            const courses = await Course.find({
                subject: newCourse.subject,
                number: newCourse.number,
                term: newCourse.term
            })
            // check if there's an existing course with the same subject, number, and term
            if (courses.length <= 0) {
                await newCourse.save()
                res.status(201).send({
                    id: newCourse._id
                })
            } else {
                res.status(400).send({
                    error: "A course with the given details already exists"
                })
            }

        } else {
            res.status(400).send({
                error: "Request body does not contain a valid Course object"
            })
        }

    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Fetch data about a specific course
/*
 * Returns summary data about the Course, excluding the list of
 * students enrolled in the course and the list of Assignments
 * for the course.
 */
router.get("/:courseId", async (req, res, next) => {
    if (req.params.courseId.length == 24) {
        const course = await Course.findOne({ _id: req.params.courseId }).select('subject number title term instructorId')

        if (course) {
            res.status(200).send(course)
        } else {
            next()
        }
    } else {
        next()
    }
})

// Update data for a specific Course.
/* 
 * Performs a partial update on the data for the Course. Note 
 * that enrolled students and assignments cannot be modified
 * via this endpoint. Only an authenticated User with 'admin'
 * role or an authenticated 'instructor' User whose ID matches
 * the instructorId of the Course can update Course information.
 */
router.patch("/:courseId", requireAuthentication, async (req, res, next) => { 
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId)

        if (course) {
            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                const updatedCourse = new Course(req.body)
                let error = updatedCourse.validateSync()

                if(!error) {
                    const courses = await Course.find({
                        subject: updatedCourse.subject,
                        number: updatedCourse.number,
                        term: updatedCourse.term
                    })
                    if (courses.length == 0) {
                        await Course.findByIdAndUpdate(req.params.courseId, 
                            { 
                                subject: updatedCourse.subject,
                                number: updatedCourse.number,
                                title: updatedCourse.title,
                                term: updatedCourse.term
                            })
                        res.status(200).send()
                    } else {
                        res.status(400).send({
                            error: "A course with these details already exists"
                        })
                    }
                } else {
                    res.status(400).send({
                        error: "The request body must contain a valid Course object"
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

// Remove a specific Course from the database.
/*
 * Completely removes the data for the specified Course,
 * including all enrolled students, all Assignments, etc. Only
 * an authenticated User with 'admin' role can remove a Course.
 */
router.delete("/:courseId", requireAuthentication, async (req, res, next) => {
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId)

        if (course) {
            if (req.user.role == 'admin') {
                await Course.findByIdAndRemove(req.params.courseId)
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

// Fetch a list of the students enrolled in the Course.
/*
 * Returns a list containing the User IDs of all students 
 * currently enrolled in the Course. Only an authenticated User
 * with 'admin' role or an authenticated 'instructor' User whose
 * ID matches the instructorId of the Course can fetch the list
 * of enrolled students.
 */
router.get("/:courseId/students", requireAuthentication, async (req, res, next) => {
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId).select('students')

        if (course) {
            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                res.status(200).send(course)
            } else {
                res.status(403).send({
                    error: "You are not authorized to access this resource"
                })
            }
        } else {
            next()
        }
    } else {
        next()
    }
})

// Update enrollment for a Course.
/* 
 * Enrolls and/or unenrolls students from a Course. Only an 
 * authenticated User with 'admin' role or an authenticated
 * 'instructor' User whose ID matches the instructorId of the
 * Course can update the students enrolled in the Course.
 */
router.post("/:courseId/students", requireAuthentication, async (req, res, next) => {
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId).select('students')

        if (course) {
            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                if (req.body.add && req.body.remove) {
                    var students = course.students.filter(e => !req.body.remove.includes(e) )

                    students.push(req.body.add)

                    await Course.findByIdAndUpdate(req.params.courseId, { students: students })
                    
                    res.status(200).send()
                } else {
                    res.status(400).send({
                        error: "The request body must include an add and remove item"
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

// Fetch a CSV file containing list of the students enrolled in the Course.
/*
 * Returns a CSV file containing information about all of the 
 * students currently enrolled in the Course, including names,
 * IDs, and email addresses. Only an authenticated User with 
 * 'admin' role or an authenticated 'instructor' User whose ID
 * matches the instructorId of the Course can fetch the course
 * roster.
 */
router.get("/:courseId/roster", requireAuthentication, async (req, res, next) => {
    // TODO: Implement
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId).select('students')

        if (course) {
            if (req.user.role == 'admin' || (req.user.role == 'instructor' && course.instructorId == req.user._id)) {
                let students = ''

                // course.students.array.forEach(element => {
                for (const student of course.students) {
                    const studentDetails = await User.findById(student)
                    students += `${studentDetails._id},${studentDetails.name},${studentDetails.email}\n`
                };

                // console.log(students)

                // TODO (maybe?) switch to actually send a file instead of text
                res.type('text/csv')
                res.status(200).send(students)
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

// Fetch a list of the Assignments for the Course.
/*
 * Returns a list containing the Assignment IDs of all 
 * Assignments for the Course.
 */
router.get("/:courseId/assignments", async (req, res, next) => {
    if (req.params.courseId.length == 24) {
        const course = await Course.findById(req.params.courseId).select('assignments')

        if (course) {
            res.status(200).send({
                assignments: course.assignments
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

module.exports = router
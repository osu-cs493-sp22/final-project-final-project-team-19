const bcrypt = require('bcryptjs')
const { Router } = require('express')

const router = Router()

const { requireAuthentication, generateAuthToken, softAuthentication } = require('../lib/auth')
const { Course } = require('../models/course')
const { userSchema, User } = require('../models/user')

// Create a new User
/* 
 * Create and store a new application User with specified data and
 * adds it to the application's database. Only an authenticated 
 * User with 'admin' role can create users with the 'admin' or 
 * 'instructor' roles. 
 */
router.post('/', softAuthentication, async (req, res, next) => {
    // TODO: check for admin role w/ new admin & instructor users

    const newUser = new User(req.body)
    let error = newUser.validateSync();
    
    if(!error) {
        const existingUser = await User.findOne({ email: newUser.email});
        // check if there's an existing user with the given email
        if (existingUser) {
            res.status(400).send({
                error: "A user with that email already exists"
            })

        } else if (newUser.role == "student") { // create student with no auth
            await newUser.save()
            // console.log(users)
            res.status(201).send({
                id: newUser._id
            })

        } else if (req.user && req.user.role == "admin") { // Consider disabling this if no admins exist in db yet
            await newUser.save()
            // console.log(users)
            res.status(201).send({
                id: newUser._id
            })
        } else {
            res.status(403).send({
                error: "You do not have permission to create a user with this role"
            })
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid User object"
        })
    }
})

// Login a user
/* 
 * Authenticate a specific User with their email address and
 * password. 
 */
router.post("/login", async (req, res, next) => {
    if (req.body && req.body.email && req.body.password ) {

        // find the user with a matching email, if any
        const user = await User.findOne({ email: req.body.email })

        // check if the credentials are valid
        const validCredentials = (user) && await bcrypt.compare(
            req.body.password,
            user.password
        )

        if (validCredentials) {
            const token = generateAuthToken(String(user._id))
            res.status(200).send({
                token: token
            })
        
        } else {
            res.status(401).send({
                error: "Invalid credentials"
            })
        }
    } else {
        res.status(400).send({
            error: "The request body must contain an email and password"
        })
    }
})

// Fetch data about a specific user
/* 
 * Returns information about the specified User. If the User has
 * the 'instructor' role, the response should include a list of
 * the IDs of the Courses the User teaches (i.e. Courses whose
 *  instructorId field matches the ID of this User). If the User
 *  has the 'student' role, the response should include a list
 *  of the IDs of the Courses the User is enrolled in. Only an
 *  authenticated User whose ID matches the ID of the requested
 *  User can fetch this information.
 */
router.get("/:userId", requireAuthentication, async (req, res, next) => {
    if(req.params.userId.length == 24) {
        const user = await User.findById(req.params.userId).select('user email password role')
        console.log(user)

        if (user) {
            if(req.user.role == 'admin' || req.user._id == req.params.userId) {
                
                if(user.role == 'instructor') {
                    let courseList = []
                    const courses = await Course.find({ instructorId: user._id }).select('_id')
                    // console.log(courses)

                    courses.forEach(element => {
                        courseList.push(element._id)
                    });

                    // console.log(courseList)

                    res.status(200).send({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role,
                        courses: courseList
                    })
                } else if (user.role == 'student') {
                    let courseList = []
                    const courses = await Course.find({ students: user._id }).select('_id')
                    // console.log("=== courses: ", courses)

                    courses.forEach(element => {
                        courseList.push(element._id)
                    });

                    res.status(200).send({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role,
                        courses: courseList
                    })
                } else {
                    res.status(200).send(user)
                }

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
module.exports = router

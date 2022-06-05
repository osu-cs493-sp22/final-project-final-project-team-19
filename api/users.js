const { Router } = require('express')

const router = Router()

const { requireAuthentication } = require('../lib/auth')
const { userSchema, User } = require('../models/user')

// Create a new User
/* 
 * Create and store a new application User with specified data and
 * adds it to the application's database. Only an authenticated 
 * User with 'admin' role can create users with the 'admin' or 
 * 'instructor' roles. 
 */
router.post('/', async (req, res, next) => {
    // TODO: add require authentication and check for admin role 
    // w/ new admin & instructor users

    const newUser = new User(req.body)
    let error = newUser.validateSync();
    if(error) {
        res.status(400).send({
            error: "Request body does not contain a valid User object"
        })
    } else {
        // console.log(newUser)
        const users = await User.find({ email: newUser.email});
        console.log(users)
        if (users.length > 0) {
            res.status(400).send({
                error: "A user with that email already exists"
            })
        } else {
            await newUser.save()
            console.log(users)
            res.status(201).send({
                id: newUser._id
            })
        }
    }
})

// Login a user
/* 
 * Authenticate a specific User with their email address and
 * password. 
 */
router.post("/login", async (req, res, next) => {
    if (req.body && req.body.email && req.body.password ) {

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
router.get(":userId", requireAuthentication, (req, res, next) => {
    // TODO: Implement
})
module.exports = router

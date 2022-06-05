const bcrypt = require('bcryptjs')
const { Router } = require('express')

const router = Router()

const { requireAuthentication, generateAuthToken } = require('../lib/auth')
const { userSchema, User } = require('../models/user')

// Create a new User
/* 
 * Create and store a new application User with specified data and
 * adds it to the application's database. Only an authenticated 
 * User with 'admin' role can create users with the 'admin' or 
 * 'instructor' roles. 
 */
router.post('/', async (req, res, next) => {
    // TODO: check for admin role w/ new admin & instructor users

    const newUser = new User(req.body)
    let error = newUser.validateSync();
    
    if(!error) {
        const users = await User.find({ email: newUser.email});
        // check if there's an existing user with the given email
        if (users.length > 0) {
            res.status(400).send({
                error: "A user with that email already exists"
            })

        } else if (newUser.role == "student") { // create student with no auth
            await newUser.save()
            console.log(users)
            res.status(201).send({
                id: newUser._id
            })

        } else { // TODO: require auth if creating instructor or admin
            await newUser.save()
            console.log(users)
            res.status(201).send({
                id: newUser._id
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
        const user = await User.find({ email: req.body.email })

        // check if the credentials are valid
        const validCredentials = (user.length == 1) && await bcrypt.compare(
            req.body.password,
            user[0].password
        )

        if (validCredentials) {
            const token = generateAuthToken(String(user[0]._id))
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
    console.log(req.user)
    const user = await User.find({ _id: req.params.userId })

    if (user.length == 1) {
        if(req.user.role == 'instructor') {
            // TODO: add the courses the student is in that the instructor teaches
            res.status(200).send({
                user: user[0].name,
                email: user[0].email,
                password: user[0].password,
                role: user[0].role
            })
        } else if (req.user._id == req.params.userId) {
            // TODO: add the courses the student is in
            res.status(200).send({
                user: user[0].name,
                email: user[0].email,
                password: user[0].password,
                role: user[0].role
            })
        } else {
            res.status(403).send({
                error: "You are not authorized to access this resource"
            })
        }
    } else {
        next()
    }

    
})
module.exports = router

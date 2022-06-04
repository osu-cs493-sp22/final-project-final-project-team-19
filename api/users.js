const { Router } = require('express')

const router = Router()

// Create a new User
/* 
 * Create and store a new application User with specified data and
 * adds it to the application's database. Only an authenticated 
 * User with 'admin' role can create users with the 'admin' or 
 * 'instructor' roles. 
 */
router.post('/', (req, res, next) => {
    // TODO: Implement
})

// Login a user
/* 
 * Authenticate a specific User with their email address and
 * password. 
 */
router.post("/login", (req, res, next) => {
    // TODO: Implement
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
router.get(":userId", (req, res, next) => {
    // TODO: Implement
})
module.exports = router

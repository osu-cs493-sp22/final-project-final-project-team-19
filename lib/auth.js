const jwt = require('jsonwebtoken');
const { User } = require('../models/user')

const secret = process.env.JWT_SECRET || 'badsecret'

function generateAuthToken(userId) {
    const payload = { sub: userId}
    return jwt.sign(
        payload,
        secret,
        { expiresIn: '24h' }
    )
}
exports.generateAuthToken = generateAuthToken

async function requireAuthentication(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null
    try {
        const payload = jwt.verify(token, secret)
        req.userId = payload.sub
        
        const user = await User.find({ _id: req.userId })

        req.user = user[0]

        // TODO: Find user by Pk/Id whatever
        // req.user = (something)
        // req.user = { // remove this after integration with database
        //     dataValues: {
        //         role_type: "admin", // student || teacher || admin
        //     }
        // }
        next()
    } catch (err) {
        res.status(401).send({
            err: 'Invalid auth token'
        })
    }
}
exports.requireAuthentication = requireAuthentication

async function softAuthentication(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null
    try {
        const payload = jwt.verify(token, secret)
        req.userId = payload.sub

        const user = await User.find({ _id: req.userId })
        req.user = user[0]
        next()
    } catch (err) {
        next()
    }
}
exports.softAuthentication = softAuthentication

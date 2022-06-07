const express = require('express')
const { connect } = require('./lib/mongoose')
const { User } = require('./models/user')
const jwt  = require('jsonwebtoken')
const redis = require('redis')


const api = require('./api')

const app = express()
const port = process.env.PORT || 8000

// redis env variables
const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = process.env.REDIS_PORT || 6379
const redisUser = process.env.REDIS_USER || 'default';
const redisPassword = process.env.REDIS_PASSWORD || 'hunter2';

// TO-DO: move rateLimit function and other redis code to redis.js?
const redisClient = redis.createClient({
  url: `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`
})

const rateLimitWindowMs = 60000
const secret = process.env.JWT_SECRET || 'badsecret'

/*
* Rate limiting function that works by a token bucket algorithm
* Max of 15 requests per window
* Error if too many requests are made
*/
async function rateLimit(req, res, next) {
  const authHeader = req.get('authorization') || ''
  const authParts = authHeader.split(' ')
  const token = authParts[0] === 'Bearer' ? authParts[1] : null
  let rateLimitMaxRequests = -1
  let ip = req.ip
  try {
    if(!token){
      throw new Error('No token')
    }
    const payload = jwt.verify(token, secret)
    req.userId = payload.sub
    const user = await User.find({ _id: payload.sub })
    if (user.length > 0) {
      rateLimitMaxRequests = 30
      ip = user[0].email
    }
    
  } catch (err) {
    rateLimitMaxRequests = 10
  }
  

  let tokenBucket = await redisClient.hGetAll(ip)
  console.log("== tokenBucket:", tokenBucket)
  tokenBucket = {
    tokens: parseFloat(tokenBucket.tokens) || rateLimitMaxRequests,
    last: parseInt(tokenBucket.last) || Date.now()
  }
  // console.log("== tokenBucket:", tokenBucket)

  const now = Date.now()
  const ellapsedMs = now - tokenBucket.last
  tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
  tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
  tokenBucket.last = now

  if (tokenBucket.tokens >= 1) {
    tokenBucket.tokens -= 1
    await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
    next()
  } else {
    await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
    res.status(429).send({
      err: "Too many requests per minute"
    })
  }
}

// rate limiting on request from ip address scale
app.use(rateLimit)

app.use(express.json());

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

/*
 * This route will catch any errors thrown from our API endpoints and return
 * a response with a 500 status to the client.
 */
app.use('*', function (err, req, res, next) {
  console.error("== Error:", err)
  res.status(500).send({
      err: "Server error.  Please try again later."
  })
})

// connect to redisClient 
console.log(`=== Connecting to redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`);
redisClient.connect()

connect(() => {
    app.listen(port, () => {
        console.log(`== Server is running on port ${port}`)
    })
})

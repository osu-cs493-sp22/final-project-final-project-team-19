// const redis = require('redis')

// const redisHost = process.env.REDIS_HOST || 'redis'
// const redisPort = process.env.REDIS_PORT || 6379
// const redisUser = process.env.REDIS_USER || 'default';
// const redisPassword = process.env.REDIS_PASSWORD || 'hunter2';

// const redisClient = redis.createClient({
//     url: 'redis://default:hunter2@redis:6379'
//   })
  
//   const rateLimitMaxRequests = 10
//   const rateLimitWindowMs = 60000
  
// async function rateLimit(req, res, next) {
//     const ip = req.ip

//     let tokenBucket = await redisClient.hGetAll(ip)
//     console.log("== tokenBucket:", tokenBucket)
//     tokenBucket = {
//         tokens: parseFloat(tokenBucket.tokens) || rateLimitMaxRequests,
//         last: parseInt(tokenBucket.last) || Date.now()
//     }
//     console.log("== tokenBucket:", tokenBucket)

//     const now = Date.now()
//     const ellapsedMs = now - tokenBucket.last
//     tokenBucket.tokens += ellapsedMs * (rateLimitMaxRequests / rateLimitWindowMs)
//     tokenBucket.tokens = Math.min(rateLimitMaxRequests, tokenBucket.tokens)
//     tokenBucket.last = now

//     if (tokenBucket.tokens >= 1) {
//         tokenBucket.tokens -= 1
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         // await redisClient.hSet(ip)
//         next()
//     } else {
//         await redisClient.hSet(ip, [['tokens', tokenBucket.tokens], ['last', tokenBucket.last]])
//         // await redisClient.hSet(ip)
//         res.status(429).send({
//         err: "Too many requests per minute"
//         })
//     }
// }

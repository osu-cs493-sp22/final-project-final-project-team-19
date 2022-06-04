const express = require('express')
const { connect } = require('./lib/mongoose')

const app = express()
const port = process.env.PORT || 8000

connect(() => {
    app.listen(port, () => {
        console.log(`== Server is running on port ${port}`)
    })
})

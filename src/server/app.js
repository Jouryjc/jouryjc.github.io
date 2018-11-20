const express = require('express')
const logger = require('morgan')
const router = require('./router/index')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

app.use(logger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cookieParser())

app.use('/user', router)

app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404;
    next(err)
})

module.exports = app
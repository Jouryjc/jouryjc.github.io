const response = require('./response')
const logger = require('./log')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

module.exports = app => {

    // 日志
    logger(app)

    app.use(bodyParser.json())

    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(cookieParser())

    // 格式化响应数据
    app.use(response())
}
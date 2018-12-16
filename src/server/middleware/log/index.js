const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

module.exports = app => {

    // 将日志写在本地access.log文件
    let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

    app.use(morgan('combined'))
    app.use(morgan('combined', { stream: accessLogStream }))
}
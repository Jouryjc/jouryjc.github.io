const express = require('express')
const router = require('./router/index')
const middleware = require('./middleware')
const app = express()

// 中间件，包含日志、响应数据处理等
middleware(app)

// 路由处理
router(app)

module.exports = app
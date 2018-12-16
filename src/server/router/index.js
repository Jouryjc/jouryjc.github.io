const express = require('express')
const userModel = require('../controller/index')
const router = express.Router()

module.exports = (app) => {

    router.get('/user', (req, res) => {
        return userModel.getList(req, res)
    })
    router.post('/user', (req, res) => {
        return userModel.addUser(req, res)
    })
    router.delete('/user/:user_id', (req, res) => {
        return userModel.delUser(req, res)
    })
    router.put('/user/:user_id', (req, res) => {
        return userModel.updateUserInfo(req, res)
    })

    app.use(router)
}
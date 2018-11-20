const express = require('express')
const userModel = require('../controller/index')
const router = express.Router()

router.route('/')
    .get((req, res) => {
        return userModel.getList(req, res)
    })
    .post((req, res) => {
        return userModel.addUser(req, res)
    })
    .delete((req, res) => {
        return userModel.delUser(req, res)
    })
    .put((req, res) => {
        return userModel.updateUserInfo(req, res)
    })

module.exports = router
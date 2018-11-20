const userModel = require('../models/user.js')
const chalk = require('chalk')

module.exports = {

    // 查询用户列表
    async getList(req, res) {

        try {
            let data = await userModel.find({}, (err) => {
                if (err) {
                    console.log(chalk.red(`查询用户列表有误，${err}`))
                }
            });

            return res.send({
                status: 200,
                data: data
            })
        } catch (e) {
            return res.send(e)
        }

    },

    // 添加用户
    async addUser(req, res) {
        let paramsData = req.body;
        try {
            let data = await userModel.create(paramsData)
            res.send({
                status: 200,
                data: data
            })
        } catch (e) {
            res.send(e)
        }
    },

    // 删除用户
    async delUser(req, res) {
        try {
            let data = await userModel.deleteOne({ _id: req.body._id})
            res.send({
                status: 200,
                data: data
            })
        } catch (e) {
            req.send(e)
        }
    },

    // 更新用户信息
    async updateUserInfo(req, res) {
        let paramsData = req.body.data;
        console.log(paramsData)
        try {
            let data = await userModel.findOneAndUpdate({
                _id: paramsData._id
            }, paramsData)

            res.send({
                status: 200,
                data: data
            })
        } catch (e) {
            res.send(e)
        }
    },
}
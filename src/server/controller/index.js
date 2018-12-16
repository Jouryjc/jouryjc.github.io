const userModel = require('../models/user.js')

module.exports = {

    // 查询用户列表
    async getList(req, res) {

        try {
            let data = await userModel.find({}, (err) => {
                if (err) {
                    res.fail(`查询用户列表有误，${err}`)
                }
            });

            return res.success(data)
        } catch (e) {
            return res.fail(e)
        }

    },

    // 添加用户
    async addUser(req, res) {
        let paramsData = req.body

        try {
            let data = await userModel.create(paramsData)

            res.success(data)
        } catch (e) {
            res.fail(e)
        }
    },

    // 删除用户
    async delUser(req, res) {
        try {
            let data = await userModel.deleteOne({ _id: req.body._id })
            res.success(data)
        } catch (e) {
            req.fail(e)
        }
    },

    // 更新用户信息
    async updateUserInfo(req, res) {
        let paramsData = req.body.data

        try {
            let data = await userModel.findOneAndUpdate({
                _id: paramsData._id
            }, paramsData)

            res.success(data)
        } catch (e) {
            res.fail(e)
        }
    },
}
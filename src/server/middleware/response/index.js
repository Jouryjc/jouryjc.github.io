module.exports = () => {

    /**
     * 设置成功响应的格式
     */
    let success = res => {
        return (json) => {

            res.set("Content-Type", "application/json")

            res.status(200)

            res.send({
                code: 1,
                data: json || {},
                msg: 'success'
            })
        }
    }

    /**
     * 设置失败响应的格式
     */
    let fail = res => {
        return msg => {
            res.set("Content-Type", "application/json")

            res.send({
                code: 0,
                data: {},
                msg: msg.toString()
            })
        }
    }

    return async(req, res, next) => {

        res.success = success(res)

        res.fail = fail(res)

        await next()
    }
}
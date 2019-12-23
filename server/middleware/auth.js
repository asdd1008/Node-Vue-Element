module.exports = options => {
    return async (req, res, next) => {
        const jwt = require('jsonwebtoken')
        const assert = require('http-assert')
        const AdminUser = require('../models/AdminUser')

        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, "请登录后进行尝试!")

        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(token, 401, "请登录后进行尝试!")

        req.user = await AdminUser.findById(id)
        assert(req.User, 401, "请登录后进行尝试!")

        await next()
    }
}
module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
    // const Category = require("../../models/Category")
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')

    //登录校验中间件
    // const authMiddleware = require("../../middleware/auth")
    const authMiddleware = async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, "11请登录后进行尝试!")

        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(token, 401, "22请登录后进行尝试!")

        req.user = await AdminUser.findById(id)
        assert(req.user, 401, "33请登录后进行尝试!")

        await next()
    }

    // 获取相关模型
    // const resourceMiddleware = require("../../middleware/resource")
    const resourceMiddleware = async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }

    app.use("/admin/api/rest/:resource", authMiddleware, resourceMiddleware, router)


    // 创建分类
    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    // 获取分类列表
    router.get('/', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(15)
        res.send(items)
    })

    // 获取分类详情列表
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 编辑分类
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除分类
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })

    // 文件上传
    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload', upload.single('file'), async (req, res, next) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 登录校验
    app.post('/admin/api/login', async (req, res, next) => {
        const { username, password } = req.body
        //1、根据用户名找用户
        const User = await AdminUser.findOne({ username }).select('+password')
        assert(User, 422, "该用户不存在")

        //2、校验密码
        const bcrypt = require('bcryptjs').compareSync(password, User.password)
        assert(bcrypt, 422, "用户密码错误，请重新输入！")

        //3、返回Token
        const token = jwt.sign({ id: User._id, _id: User._id, userName: User.userName }, app.get('secret'))
        res.send(token)
    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}
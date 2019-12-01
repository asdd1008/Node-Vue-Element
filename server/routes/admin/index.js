module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
    // const Category = require("../../models/Category")

    // 创建分类
    router.post('/', async (req, res) => {
        console.log(req.body)
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

    app.use("/admin/api/rest/:resource", async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router)

    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload', upload.single('file'), async (req, res, next) => {
        const file = req.file
        // console.log(file)
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
}
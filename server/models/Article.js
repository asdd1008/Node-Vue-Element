const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    // 关联类型
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
})

module.exports = mongoose.model('Article', schema)
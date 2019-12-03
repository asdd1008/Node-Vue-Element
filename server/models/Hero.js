const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    name: { type: String },
    avatar: { type: String },
    title: { type: String },
    // 关联类型
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    // 人物评分
    scores: {
        skill: { type: Number },
        attack: { type: Number },
        survive: { type: Number },
        defficult: { type: Number },
    },
    // 技能
    skills: [
        {
            icon: { type: String },
            name: { type: String },
            description: { type: String },
            tips: { type: String },
        }
    ],
    // 装备/顺风
    items1: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }
    ],
    // 装备/逆风
    items2: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }
    ],
    // 使用技巧
    usageTips: { type: String },
    // 对抗技巧
    battleTips: { type: String },
    // 团战思路
    teamTips: { type: String },
    // 英雄关系
    partners: [
        {
            hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
            description: { type: String }
        }
    ]
})

module.exports = mongoose.model('Hero', schema)
var mongoose = require("mongoose");

//定义内容的表结构，并对外提供接口
module.exports = new mongoose.Schema({
	//关联表结构
	/*
		关联字段 - 内容分类的id
	*/
	category: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用，我们插入内容的时候，关联分类表
		ref: "Category"
	},
	title: String,
	description: {
		type: String,
		default: ""
	},
	//内容
	content: {
		type: String,
		default: ""
	},
	user: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用，我们插入内容的时候，关联分类表
		ref: "User"
	},
	//添加事件
	addTime: {
		type: Date,
		default: new Date()
	},
	//阅读量
	views: {
		type: Number,
		default: 0
	}

})













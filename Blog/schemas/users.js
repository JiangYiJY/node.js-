var mongoose = require("mongoose");

//定义用户的表结构，并对外提供接口
module.exports = new mongoose.Schema({
	//用户名：
	username: String,
	//密码
	password: String,
	//是否是管理员
	isAdmin: {
		type: Boolean,
		default: false
	}
})
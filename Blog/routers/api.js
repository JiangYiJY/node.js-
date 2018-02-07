var express = require("express");
var router = express.Router();
//引入数据模型
var User = require("../models/User");

//处理注册的信息
//定义一个统一的返回格式
var responseData;

router.use(function(req, res, next){
	responseData = {
		code: 0,  //错误码
		message: "" //信息
	}
	next();
})
/*
	需要在api.js里增加路由
*/
router.post("/user/register", function(req, res, next){
	// console.log("register");
	// console.log(req.body);
	/*
		下面编写注册的逻辑
		1、基本注册逻辑判断
			（1）用户名不能为空
			（2）密码不能为空
			（3）两次输入的密码应该相同

		2、和数据库中数据进行比对，判断是否被注册了
	*/

	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//用户名是否为空
	if(username == ""){
		responseData.code = 1;
		responseData.message = "用户名不能为空";
		//返回前端
		res.json(responseData);
		return;
	}

	//密码不能为空
	if(password == ""){
		responseData.code = 2;
		responseData.message = "密码不能为空";
		//返回前端
		res.json(responseData);
		return;
	}
	//两次密码不一样
	if(password != repassword){
		responseData.code = 3;
		responseData.message = "两次输入密码不一致";
		//返回前端
		res.json(responseData);
		return;
	}

	//插入一般判断后面
	/*
		用户名已经被注册了
		如果数据库中已经存在和我们要注册的用户名同名的数据
		表示用户已经被注册了
	*/
	User.findOne({
		username: username
	}).then(function(userInfo){
		if(userInfo){
			//表明数据库中有该记录
			responseData.code = 4;
			responseData.message = "用户名已经被注册了";
			res.json(responseData);
			return;
		}
		//保存用户注册的信息到数据库中
		var user = new User({
			username: username,
			password: password
		});
		//保存在数据库
		return user.save();
	}).then(function(newUserInfo){
		console.log(newUserInfo);
		//注册成功，数据也成功保存在数据库中了
		responseData.message = "注册成功";
		res.json(responseData);
	})

})

//用户登录的路由
router.post("/user/login", function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;

	if(username == "" || password == ""){
		responseData.code = 1;
		responseData.message = "用户名和密码不能为空";
		res.json(responseData);
		return;
	}

	//判断数据库是否有这个数据
	User.findOne({
		username: username,
		password: password
	}).then(function(userInfo){
		// console.log(userInfo)
		if(!userInfo){
			responseData.code = 2;
			responseData.message = "用户名或密码错误";
			res.json(responseData);
			return;
		}

		//查询成功，登录成功
		responseData.message = "登录成功";
		//将登录信息返还给前端页面
		responseData.userInfo = {
			_id: userInfo._id,
			username: userInfo.username
		}
		//发送cookies给前端页面
		req.cookies.set("userInfo", JSON.stringify({
			_id: userInfo._id,
			username: userInfo.username
		}))

		res.json(responseData);
		return;
	})
})

/*
	退出
*/
router.get("/user/logout", function(req, res){
	//将cookie清除
	req.cookies.set("userInfo", null);
	res.json(responseData);
})


module.exports = router;

















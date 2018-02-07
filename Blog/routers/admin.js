var express = require("express");
var router = express.Router();
var User = require("../models/User");

//先去进行管理员身份的判断
router.use(function(req, res, next){
	if(!req.userInfo.isAdmin){
		//当前用户是非管理员
		res.send("对不起，只有管理员才能登录后台");
		return;
	}else{
		next();
	}
})

router.get("/", function(req, res, next){
	// res.send("后台管理页");
	//加载后台管理页面
	res.render("admin/index", {
		userInfo: req.userInfo
	})
})
/*
	用户管理路由
*/
router.get("/user", function(req, res, next){
	/*
		从数据库中，将所有用户数据读取出来

		1、要实现分页，就要借助于数据库 limit(number)显示数据的条数
		2、需要查从哪条数据开始，skip(number)忽略数据的条数

		每页显示两条数据
		skip(0).limit(2)
		第一页：1-2 skip(0) - > 当前页 - 1 * 显示条数
		第二页：3-4
	*/
	var page = req.query.page || 1;
	var limit = 2;

	/*
		【注】在这里一定要注意，我们的页数不能低于1，也不能大于数据库中总页数

	*/
	User.count().then(function(count){
		// console.log(count);
		//取值限制
		var pages = Math.ceil(count / limit);
		//取值不能超过pages
		page = Math.min(page, pages);
		//取值不能小于1
		page = Math.max(page, 1);
		var skip = (page - 1) * limit;

		User.find().limit(limit).skip(skip).then(function(users){
			// console.log(users); 可以看数据
			res.render("admin/user_index", {
				userInfo: req.userInfo,
				users: users,
				page: Number(page),  //前端页面需要知道当前是第几页。
				pages: Number(pages)
			})
		})
	})
})

module.exports = router;
















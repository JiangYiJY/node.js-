var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Category = require("../models/Category")

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

/*
	分类首页
*/
router.get("/category", function(req, res){
	var page = req.query.page || 1;
	var limit = 2;

	/*
		【注】在这里一定要注意，我们的页数不能低于1，也不能大于数据库中总页数

	*/
	Category.count().then(function(count){
		// console.log(count);
		//取值限制
		var pages = Math.ceil(count / limit);
		//取值不能超过pages
		page = Math.min(page, pages);
		//取值不能小于1
		page = Math.max(page, 1);
		var skip = (page - 1) * limit;

		Category.find().limit(limit).skip(skip).then(function(categories){
			// console.log(users); 可以看数据
			res.render("admin/category_index", {
				userInfo: req.userInfo,
				categories: categories,
				page: Number(page),  //前端页面需要知道当前是第几页。
				pages: Number(pages)
			})
		})
	})
})

/*
	分类添加的
*/
router.get("/category/add", function(req, res){
	res.render("admin/category_add", {
		userInfo: req.userInfo
	})
})

/*
	分类保存

	根据post提交表单数据，进行分类保存
	数据库
	mongoose
	建立结构 -> 建立模型 -> 引入模型
*/
router.post("/category/add", function(req, res){
	/*
		处理post提交过来的数据
		对提交过来的数据进行验证
	*/
	// console.log(req.body.name);
	var name = req.body.name || "";
	if(name == ""){
		//如果为空，我们渲染一个错误提示页面
		res.render("admin/error", {
			userInfo: req.userInfo,
			message: "名称不能为空"
		});
		return;
	}

	//验证数据库中是否已经存在同名的分类名称
	Category.findOne({
		name: name
	}).then(function(rs){
		if(rs){
			//数据库中已经存在了该分类
			res.render("admin/error", {
				userInfo: req.userInfo,
				message: "分类已经存在了"
			})
			return Promise.reject();
		}else{
			//数据库中没有改分类
			return new Category({
				name: name
			}).save();
		}
	}).then(function(newCategory){
		res.render("admin/success", {
			userInfo: req.userInfo,
			message: "分类保存成功",
			url: "/admin/category"
		})
	})
})


/*
	分类修改
*/
router.get("/category/edit", function(req, res){
	//获取我要修改的分类的id
	var id = req.query.id || "";
	//查找数据库
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category){
			res.render("admin/error", {
				userInfo: req.userInfo,
				message: "分类信息不存在"
			})
		}else{
			//跳转到编译预览页面
			res.render("admin/category_edit", {
				userInfo: req.userInfo,
				category: category
			})
		}
	})
})

/*
	分类信息的保存
*/
router.post("/category/edit", function(req, res){
	//获取我要修改的分类的id
	var id = req.query.id || "";
	var name = req.body.name || "";

	//查找数据库
	Category.findOne({
		_id: id
	}).then(function(category){
		if(!category){
			res.render("admin/error", {
				userInfo: req.userInfo,
				message: "分类信息不存在"
			})
			return Promise.reject();
		}else{
			
			//当用户没有做任何修改提交的时候
			if(name == category.name){
				res.render("admin/success", {
					userInfo: req.userInfo,
					message: "修改成功",
					url: "/admin/category"
				});
				return Promise.reject();
			}else{
				//要修改的分类名称是否在数据库中已经存在了
				return Category.findOne({
					name: name,
					_id: {$ne: id}
				})
			}
		}
	}).then(function(sameCategory){
		if(sameCategory){
			res.render("admin/error", {
				userInfo: req.userInfo,
				message: "数据库中已经存在同名的分类了"
			})
			return Promise.reject();
		}else{
			return Category.update({
				_id: id
			}, {
				name: name
			})
		}
	}).then(function(){
		res.render("admin/success", {
			userInfo: req.userInfo,
			message: "修改成功",
			url: "/admin/category"
		})
	})
})

module.exports = router;












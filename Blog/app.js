//入口文件

//加载express模块
var express = require("express");
//加载模板处理前后端
var swig = require("swig");
//加载数据库模块
var mongoose = require("mongoose");
//引入入body-parser模块
var bodyParser = require("body-parser");
//引入cookies模块
var Cookies = require("cookies");
//引入模板
var User = require("./models/User");


//创建app应用 => NodeJS http.createServer()
var app = express();




//配置应用模板
/*
	中间件

	定义当前应用所使用的模板引擎，使用swig.renderFile 方法解析后缀的html的文件
	第一个参数：模板引擎的名称，同时也是模板文件的后缀
	第二个参数：表示用户解析处理模板内容方法
*/
app.engine("html", swig.renderFile);

/*
	设置模板文件存放的目录
	第一个参数必须是views
	第二参数是文件存储目录
*/
app.set("views", "./views");

/*
	注册所使用模板引擎
	第一个参数：不能改，必须是 view engine
	第二个参数：和app.engine这个方法中定义的模板引擎的名称（第一个参数）一致
*/
app.set("view engine", "html");

/*
	【注】这里注意，在开发过程中，需要取消模板缓存
*/
swig.setDefaults({cache: false});


/*
	设置cookie模块
*/
app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);
	//打印cookies
	// console.log(req.cookies.get("userInfo"));
	/*
		因为在各个路由中都需要判断用户是否登录，所以我门可以挂在在req上
		解析登录的用户的cookie信息
	*/
	req.userInfo = {};
	if(req.cookies.get("userInfo")){
		try{
			//获取登录信息
			req.userInfo = JSON.parse(req.cookies.get("userInfo"));
			//在数据库中查找，是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(err){
			next();
		}
	}else{
		next();
	}

})


//设置监听main.css的路由
/*app.get("/main.css", function(req, res, next){
	
		// 默认发送时html格式的数据，没办解析
		// 在这里需要设置解析格式头
	
	res.setHeader("content-type", "text/css");

	res.send("body {background-color: red}");	
})*/

/*
	bodyParser 设置
*/
app.use(bodyParser.urlencoded({extended: true}));

/*
	设置静态文件托管
	下述代码的意思是，如果加载的url是以/public开头的，就执行后续的操作
	__dirname 找到当前文件所在的根目录的绝对路径
*/
app.use("/public", express.static(__dirname + "/public"));


app.use("/admin", require('./routers/admin'));
app.use("/api", require("./routers/api"));
app.use("/", require("./routers/main"));

/*
	监听首页
	监听输入路径/，处理操作
*/
/*app.get("/", function(req, res, next){
	// res.send("<h1>欢迎光临我的博客~</h1>");
	res.render("index");
})*/



//链接数据库
mongoose.connect("mongodb://127.0.0.1:27017", function(err){
	if(err){
		console.log("数据库链接失败：" + err);
	}else{
		console.log("数据库链接成功");
		//监听端口号
		app.listen("8081");
	}
})
















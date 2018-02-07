var express = require("express");
var router = express.Router();
var Category = require("../models/Category");

router.get("/", function(req, res, next){
	// res.send("MAIN - User");

	// console.log(req.userInfo);

	Category.find().then(function(categories){
		//加载 index.html
		res.render("main/index", {
			userInfo: req.userInfo,
			categories: categories
		});
	})

})

module.exports = router;

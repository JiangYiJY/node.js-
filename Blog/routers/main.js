var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next){
	// res.send("MAIN - User");

	console.log(req.userInfo);

	//加载 index.html
	res.render("main/index", {
		userInfo: req.userInfo
	});
})

module.exports = router;

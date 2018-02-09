var mongoose = require("mongoose");
var contentsSchema = require("../schemas/contents");


//完成一个模型类
module.exports = mongoose.model("Content", contentsSchema);

/*
	【注】后期可以通过这个模型类创建对象
	直接对表中的数据进行操作。
*/
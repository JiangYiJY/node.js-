var mongoose = require("mongoose");
var usersSchema = require("../schemas/users");


//完成一个模型类
module.exports = mongoose.model("User", usersSchema);

/*
	【注】后期可以通过这个模型类创建对象
	直接对表中的数据进行操作。
*/
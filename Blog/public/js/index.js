// 首页JS逻辑
$(function(){
	$loginBox = $("#loginBox");
	$registerBox = $("#registerBox");
	$userInfo = $("#userInfo");

	//点击注册，切换到注册面板
	$loginBox.find("a").on("click", function(){
		$registerBox.show();
		$loginBox.hide();
	})
	//点击登录，切换到登录面板
	$registerBox.find("a").on("click", function(){
		$registerBox.hide();
		$loginBox.show();
	})


	//注册
	$registerBox.find("button").on("click", function(){
		//点击注册按钮，通过ajax post提交数据
		$.ajax({
			type: "POST",
			url: "/api/user/register",
			data: {
				username: $registerBox.find("[name=username]").val(),
				password: $registerBox.find("[name=password]").val(),
				repassword: $registerBox.find("[name=repassword]").val()
			},
			dataType: "json",
			success: function(result){
				$registerBox.find(".textCenter").html(result.message);
				// 将注册成功的信息显示在页面上
				if(!result.code){
					//注册成功
					setTimeout(function(){
						$registerBox.hide();
						$loginBox.show();
					}, 1000);
				}
			},
			error: function(err){
				console.log("请求错误:" + err);
			}
		})
	})

	//在这里我们只是完成将前段的注册信息提交
	//MD5 不可逆加密

	//登录
	$loginBox.find("button").on("click", function(){
		//通过ajax提交请求
		$.ajax({
			type: "post",
			url: "api/user/login",
			data: {
				username: $loginBox.find("[name=username]").val(),
				password: $loginBox.find("[name=password]").val()
			},
			dataType: "json",
			success: function(result){
				// console.log(result);
				$loginBox.find(".textCenter").html(result.message);
				if(!result.code){
					//登录成功
					setTimeout(function(){
						//重载
						window.location.reload();
					}, 1000);
				}
			}
		})
	})

	/*
		退出
	*/
	$("#logoutBtn").on("click", function(){
		$.ajax({
			url: "/api/user/logout",
			success: function(result){
				if(!result.code){
					//重载页面
					window.location.reload();
				}
			},
			error: function(err){
				console.log("退出错误：" + err);
			}	
		})
	})
})
























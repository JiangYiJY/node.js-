$(function(){


	$("#messageBtn").on("click", function(){

		//当点击按钮的时候，应该通过post来提交数据
		$.ajax({
			type: "POST",
			url: "/api/comment/post",
			data: {
				//1、这篇文章的id， 评论的内容
				contentid: $("#contentId").val(),
				content: $("#messageContent").val()
			},
			success: function(responseData){
				// console.log(responseData.data.comments);
				//清空评论
				$("#messageContent").val("");

				//通过传输过来的最新的数据，渲染给下面已经评论的信息
				renderComment(responseData.data.comments);
			}

		})
	})
})

//封装方法渲染数据
function renderComment(comments){
	var html = "";

	//倒序
	comments.reverse();
	for(var i = 0; i < comments.length; i++){
		html += `<div class="messageBox">
               		<p class="name clear">
	               		<span class="fl">${comments[i].username}</span>
	               		<span class="fr">${comments[i].postTime}</span>
               		</p>
               		<p>${comments[i].content}</p>
            </div>`
	}
	$(".messageList").html(html);
}

















function initPage(){
	var personData = JSON.parse(localStorage.getItem('User')),
		phone;
	$('#person-name').html(personData.nickname);
	$('#person-img').attr('src',personData.avatar);
	$.ajax({
		type:"get",
		url: config.SERVER+"/getCustomerPhone",
		async:true,
		success:function(data){
			phone = data.data;
		},
		error:function(data){
			
		}
	});
	$('#serviceInfo').on('tap',function(){
		hint.show('客服电话：'+phone);
	})
}

$(function(){
	initPage();
})

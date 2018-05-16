
function initPage(){
	$.ajax({
		type:"get",
		url: config.SERVER+"/getCustomerPhone",
		async:true,
		success:function(data){
			
			$('#phone').html(data.data);
		},
		error:function(data){
			
		}
	});
}

$(function(){
	initPage();	
})

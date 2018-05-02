/*
 **
 
 搜索页面JS代码
 
  
 **
*/
function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}
function pageInit(){
	var value = QueryString("searchValue")
	$("#searchValue").val(decodeURI(value));
	
}

$(function(){
	pageInit();
	$('#searchBtn').on("touchend",searchBtnClick);
})

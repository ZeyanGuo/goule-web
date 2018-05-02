/*
 **
 
 主页面JS代码
 
  
 **
*/
function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}


$(function() {
	$('#full_feature').swipeslider();
	$('#searchBtn').click(searchBtnClick);
});
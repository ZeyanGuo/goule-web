/*
 **
 
 推荐页面JS代码
 
  
 **
*/
var goodsType = [
	"--- 精品推荐 ---",
	"--- 新品上市 ---",
	"--- 商家折扣 ---"
]
function pageInit(){
	var value = QueryString("goodsType");
	$("#goodsType").html(goodsType[value]);
}

function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}



$(function() {
	$('#searchBtn').click(searchBtnClick);
	pageInit();
});
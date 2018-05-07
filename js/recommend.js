/*
 **
 
 推荐页面JS代码
 
  
 **
*/
var goodsType = [
	"--- 精品推荐 ---",
	"--- 新品上市 ---",
	"--- 其他商品 ---"
],page = 1,limit = 10,value;
function pageInit(){
	value = QueryString("goodsType");
	$("#goodsType").html(goodsType[value]);
	
	getInfoAndRender();
	$('.goule-more-data-operation').on('tap',getMoreItem);
	
}
function getInfoAndRender(){
	load.show();
	switch(value){
		case '0':{
			$.ajax({
				type:"GET",
				url:config.SERVER+"/getRecommend",
				data:{
					page:page,
					limit:limit
				},
				async:true,
				success:function(data){
					load.hide();
					producePageInfo(data.data);
				},
				error:function(){
					load.hide();
					hint.show('获取信息失败,请稍后重试');
				}
			});		
		} break;
		case '1':{
			$.ajax({
				type:"GET",
				url:config.SERVER+"/getLatest",
				data:{
					page:page,
					limit:limit
				},
				async:true,
				success:function(data){
					load.hide();
					producePageInfo(data.data);
				},
				error:function(){
					load.hide();
					hint.show('获取信息失败,请稍后重试');
				}
			});
		} break;
		case '2':{
			$.ajax({
				type:"GET",
				url:config.SERVER+"/getGoodByType",
				data:{
					typeid:32,
					page:page,
					limit:limit
				},
				async:true,
				success:function(data){
					load.hide();
					producePageInfo(data.data);
				},
				error:function(){
					load.hide();
					hint.show('获取信息失败,请稍后重试');
				}
			});
		} break;
		default:{}
	}
}
function producePageInfo(data){
	var moreOperation = $('.goule-more-data-operation'),
		itemContainer = $('.goule-goods-classify-container');
	if(data.length<limit){
		moreOperation.html('没有更多信息');
		moreOperation.attr('data-more','false');
	}
	data.map(function(obj){
		itemContainer.append(addItem(obj));
	})
};

function addItem(obj){
	var html = `<a href="goodsInformation.html?id=${obj.id}" class = "goule-goods-info">
						<div class = "goule-goods-img-container">
							<img class = "goule-goods-img" src="${obj.firstImage}" />
						</div>
						<p class = "goule-goods-name">
							${obj.name}
						</p>
						<p class = "goule-goods-others">
							<span>¥${obj.price}</span>
						</p>
					</a>`
	return html;
}

function getMoreItem(){
	var moreOperation = $('.goule-more-data-operation'),
		hasMore = moreOperation.attr('data-more');
	
	if(hasMore == 'true'){
		page += 1;
		getInfoAndRender();
	}
}



function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}



$(function() {
	$('#searchBtn').click(searchBtnClick);
	pageInit();
});
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
	var value = decodeURI(QueryString("searchValue")),
		limit = 10;
	$("#searchValue").val(decodeURI(value));
	load.show();
	$.ajax({
		type:"GET",
		url:config.SERVER+"/goodSearch",
		async:true,
		data:{
			xtoken:xtoken,
			key:value,
			limit:limit,
			page:1
		},
		success:function(data){
			load.hide();
			produceSearchPage(data.data,limit);
			$('.goule-search-container').attr('data-page',1);
		},
		error:function(err){
			load.hide();
			showComfirm('获取数据失败，请检查网络设置',function(){},function(){})
		}
	});
	
	$('.goule-search-controler').on('tap',function(){
		searchMore(value,limit);
	});
}

function produceSearchPage(data,limit){
	var itemContainer = $('.goule-search-container'),
		moreBtn = $('.goule-search-controler');
	if(data.length<limit){
		moreBtn.attr('data-more','false');
		moreBtn.children('p').html('没有更多信息');
	}
	else{
		moreBtn.attr('data-more','true');
	}
	data.map(function(obj){
		itemContainer.append(addItem(obj));
	})
}

function addItem(obj){
	var imageShow = obj.thumbnail.split(';')[0]
	var price = '¥'+obj.price.toFixed(2),
		html = `<a class = "goule-search-item" href="goodsInformation.html?id=${obj.id}">
				<img src="${imageShow}" />
				<div class="goule-search-item-info">
					<p class = "goule-search-goods-describe">${obj.name}</p>
					<p class = "goule-search-goods-price">${price}</p>
				</div>
			</a>`
	return html;
}

function searchMore(value,limit){
	var searchBtn = $('.goule-search-controler'),
		more = searchBtn.attr('data-more'),
		page = Number($('.goule-search-container').attr('data-page'))+1;
	
	if(more == 'true'){
		load.show();
		$.ajax({
			type:'GET',
			url:config.SERVER+"/goodSearch",
			async:true,
			data:{
				xtoken:xtoken,
				key:value,
				limit:limit,
				page:page
			},
			success:function(data){
				load.hide();
				produceSearchPage(data.data,limit);
				$('.goule-search-container').attr('data-page',page);
			},
			error:function(){
				load.hide();
				showComfirm('获取数据失败，请检查网络设置',function(){},function(){});
			}
		});
	}
	else if(more == 'false'){
		
	}
	
}

$(function(){
	pageInit(); 
	$('#searchBtn').on("touchend",searchBtnClick);
	
})

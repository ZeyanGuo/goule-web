function pageInit(){
	//初始化方法
	bindClassifyClick();
	produceQueryClassiFy();
	bindAddMore();
}

function getQueryItem(index,id,page){
	var limit = 10;
	load.show();
	$.ajax({
		type:'GET',
		url:config.SERVER+"/getGoodByType",
		data:{
			typeid:id,
			page:page,
			limit:limit
		},
		async:true,
		success:function(data){
			load.hide();
			addItemToContainer(index,page,data.data,limit);
		},
		error:function(err){
			load.hide();
			showComfirm('获取数据失败，请检查网络设置',function(){},function(){});
		}
	})
}

function addItemToContainer(index,page,data,limit){
	$('.goule-classify-container').map(function(){
		if($(this).attr("data-tag") == index){
			$(this).attr('data-page',page);
			var moreOperation = $(this).find('.load-more'),
				itemContainer = $(this).find('.goule-classify-item-container'),
				noneText = $(this).find('.goule-classify-item-none');
			if(page == 1 && data.length == 0){
				noneText.show();
			}
			if(data.length<limit){
				moreOperation.html('没有更多数据');
				moreOperation.attr('data-more','false');
			}
			data.map(function(obj,index){
				itemContainer.append(addItem(obj));
			});
		}
	});
}

function produceQueryClassiFy(){
	load.show();
	$.ajax({
		type:"GET",
		url:config.SERVER+"/getGoodTypes",
		async:true,
		success:function(data){
			load.hide();
			produceTypes(data.data);
			getQueryItem(0,data.data[0].id,1);
			$('[data-tag = 0]').show();
		},
		error:function(err){
			load.hide();
			showComfirm('获取数据失败，请检查网络设置',function(){},function(){});
		}
		
	});
}
function produceTypes(data){
	var typeContainer = $('.goule-classify');
	data.map(function(obj,index){
		typeContainer.append(addType(obj,index));
		$(addTypeContainer(obj,index)).insertBefore('.goule-footer-area-holder');
	})
}
function addType(data,index){
	var active = index==0?'goule-classify-active':'',
		html = `<div class = "goule-classify-item ${active}" data-tag = "${index}" data-id = "${data.id}">
					<p>${data.gtname}</p>
				</div>`;
	return html;
}
function addTypeContainer(data,index){
	var html = `<div class = "goule-classify-container" data-tag = "${index}" data-id = "${data.id}" style="display:none" data-page = "0">
					<p>${data.gtname}</p>
					<div class="goule-classify-item-container">
						<p class = "goule-classify-item-none" style="display:none">没有相关商品哟</p>
					</div>
					<p class = "load-more" data-id = "${data.id}" data-more = "true">点击加载更多</p>
				</div>`
	return html;
}

function addItem(data){
	var imageShow = data.thumbnail.split(';')[0];
    var smallRecommend = `<a href="goodsInformation.html?id=${data.id}" class = "goule-goods-info">
						<div class = "goule-goods-img-container">
						<img class = "goule-goods-img" src="${imageShow}" />
						</div>
						<p class = "goule-goods-name">
							${data.name}
						</p>
						<p class = "goule-goods-others">;`
	return smallRecommend;
}


function bindClassifyClick(){
	$('.goule-classify').on('tap',changeSelected)
}

function changeSelected(e){
	var target = $(e.target),
		loadPage;
	
	if(target[0].tagName === "P"){
		target = target.parent();
	}
	if(target.attr('class') !== 'goule-classify'){
		loadPage = target.attr('data-tag');
		target.siblings().removeClass('goule-classify-active');
		target.addClass('goule-classify-active');
		$('.goule-classify-container').map(function(){
			if($(this).attr("data-tag") == loadPage){
				var page = $(this).attr('data-page');
				$(this).siblings('.goule-classify-container').hide();
				$(this).show();
				if(page == 0){
					getQueryItem($(this).attr('data-tag'),$(this).attr('data-id'),1);
				}
			}
		})
	}
}

function bindAddMore(){
	$('body').on('click',function(e){
		var target = $(e.target);
		if(target.attr('class') == 'load-more'&& target.attr('data-more') == 'true'){//点击的是获取更多并且存在更多
			var page = Number(target.parent().attr('data-page'))+1,
				index = target.parent().attr('data-tag');
			getQueryItem(index,target.attr('data-id'),page);
		}
	})
}

$(function(){
	pageInit();
})

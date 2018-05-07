/*
 **
 
 主页面JS代码
 
  
 **
*/

function initPage(){
	load.show();
	$.ajax({
		type:"GET",
		url: config.SERVER + "/getIndex",
		async:true,
		
		success:function(data){
			load.hide();
			produceIndexPage(data);
		},
		error:function(err){
			load.hide();
			showComfirm('获取数据失败，请检查网络设置',function(){},function(){})
			
		}
	});
	getUserInfo();
}

function produceIndexPage(data){
	var carousel = data.data.carousel,
		carouselContainer = $('.sw-slides'),
		hots = data.data.hots,
		hotsContainer = $('#hotsContainer'),
		latest = data.data.latest,
		latestContainer = $('#latestContainer'),
		others = data.data.others,
		othersContainer = $('#othersContainer');
	
	carousel.map(function(obj){
		carouselContainer.append(addCarousel(obj));
	});
	$('#full_feature').swipeslider();
	
	if(hots.length>0){
		hotsContainer.find('.index-none-data').hide();
		hots.map(function(obj){
			hotsContainer.append(addSmallRecommend(obj));
		})
	}
	if(latest.length>0){
		latestContainer.find('.index-none-data').hide();
		latest.map(function(obj){
			latestContainer.append(addSmallRecommend(obj));
		})
	}
	if(others.length>0){
		othersContainer.find('.index-none-data').hide();
		others.map(function(obj){
			othersContainer.append(addSmallRecommend(obj));
		})
	}
}

function addCarousel(data){//添加轮播图
	var ImgCarousel = `<li class="sw-slide">
							<a href="goodsInformation.html?id=${data.id}">
								<img src="${data.firstImage}" alt="${data.name}">
							</a>
						</li>`
	return ImgCarousel;
}

function addSmallRecommend(data){
	var price = '¥'+data.price.toFixed(2),
	smallRecommend = `<a href="goodsInformation.html?id=${data.id}" class = "goule-goods-info">
						<div class = "goule-goods-img-container">
						<img class = "goule-goods-img" src="${data.firstImage}" />
						</div>
						<p class = "goule-goods-name">
							${data.name}
						</p>
						<p class = "goule-goods-others">
							<span>${price}</span>
						</p>
					</a>`;
	return smallRecommend;
}

function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}

function getUserInfo(){
	var code = QueryString('code');
	
	load.show();
	
	if(!!code){//code存在
		$.ajax({
			type:'GET',
			url:config.SERVER+'/getUserInfo',
			async:true,
			data:{
				code:code
			},
			success:function(data){
				//本地存储用户信息
				load.hide();
				if(data.code == 1){
					localStorage.setItem('User',JSON.stringify(data.data));
				}
				else{
					hint.show('获取用户信息失败');
					window.location.href = 'error.html';
				}
				
			},
			error:function(){
				hint.show('用户信息获取失败');
			}
		})
	}
	
	
}

$(function() {
	
	$('#searchBtn').click(searchBtnClick);
	initPage();
});
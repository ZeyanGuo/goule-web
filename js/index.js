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
		hotsContainer = $('#hotsCn'),
		discounts = data.data.discounts,
		discountsContainer =  $('#discountCn'),
        funfood = data.data.funfood,
        funfoodContainer =  $('#funsnackCn'),
        freshfood = data.data.freshfood,
        freshfoodContainer =  $('#freshfoodCn');

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
    if(discounts.length>0){
        discountsContainer.find('.index-none-data').hide();
        discounts.map(function(obj){
            discountsContainer.append(addSmallRecommend(obj, true));
        })
    }
    if(funfood.length>0){
        funfoodContainer.find('.index-none-data').hide();
        funfood.map(function(obj){
            funfoodContainer.append(addSmallRecommend(obj));
        })
    }
    if(freshfood.length>0){
        freshfoodContainer.find('.index-none-data').hide();
        freshfood.map(function(obj){
            freshfoodContainer.append(addSmallRecommend(obj));
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

function addSmallRecommend(data, show){
    var price = data.price.toFixed(2);
	var disprice = data.price;
	if (data.discount == 1) {
		disprice = (disprice * data.discountrate / 100).toFixed(2);
	}
	var smallRecommend = `<a href="goodsInformation.html?id=${data.id}" class = "goule-goods-info">
						<div class = "goule-goods-img-container">
						<img class = "goule-goods-img" src="${data.firstImage}" />
						</div>
						<p class = "goule-goods-name">
							${data.name}
						</p>
						<p class = "goule-goods-others">`;
	if (disprice < price && show) {
		smallRecommend += `<span style="text-decoration:line-through;color: black;">${price}</span>
							<span>¥${disprice}</span></p></a>`;
	} else {
        smallRecommend += `<span>¥${disprice}</span></p></a>`;
	}

	return smallRecommend;
}

function searchBtnClick(){
	var value = $('#searchValue').val();
	window.location = "search.html?searchValue="+value;
}

function getUserInfo(){
	var code = QueryString('code');
	
	load.show();
	
/*	if(!!code){//code存在
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
	} else {
		var userInfo = localStorage.getItem('User');
		if(userInfo == null){
			window.location.href = 'error.html';
		}
	}*/
}

$(function() {
	
	$('#searchBtn').click(searchBtnClick);
	initPage();
});
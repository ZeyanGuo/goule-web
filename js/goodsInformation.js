function pageInit(){
	var id = value = QueryString("id");
	load.show();
	$.ajax({
		type:"GET",
		url:config.SERVER+"/getGoodDetail",
		data:{
			xtoken:xtoken,
			goodid:id
		},
		async:true,
		success:function(data){
			load.hide();
			produceGoodsInfoPage(data.data);
			$('#buy-now').on('tap',function(){
				buyGoods(data.data.good);
			});
			$('#add-shopping-car').on('tap',function(){
				addShoppingCar(data.data.good);
			});
		},
		error:function(){
			load.hide();
			$('.goule-search-container').attr('data-page',1);
		}
	});
}

function produceGoodsInfoPage(data){
	produceThumbNail(data.good.thumbnail);
	produceBaseInfo(data.good);
	//produceRelateGoods(data.relative);
	produceGoodsIntroduction(data.good);
	produceVideo(data.good)
}
function produceVideo(data){
	var videoContainer = $('.goule-goods-short-video'),
		video = $('.goule-goods-video');
	if(data.video != ''){
		videoContainer.show()
		video.attr('src',data.video);
	}
	else{
		videoContainer.hide();
	}
}
function produceGoodsIntroduction(data){
	var imgs = data.introduce.split(';'),
		introduceContainer = $('.goule-goods-introduction');
	
	if(imgs.length == 1 && imgs[0] == ''){
		introduceContainer.hide();
	}
	
	imgs.map(function(obj){
		introduceContainer.append(addIntroduceItem(obj));	
	})
}
function addIntroduceItem(obj){
	var html = `<img src="${obj}" />`
	return html;
}
/*function produceRelateGoods(data){
	var relateContainer = $('.goule-goods-vertical-scroll');
	if(data.length == 0){
		relateContainer.hide();
	}
	data.map(function(obj){
		relateContainer.append(addRelateItem(obj))
	})
}*/

function addRelateItem(obj){
	var price = '¥'+obj.price.toFixed(2),
		html = `<a href="goodsInformation.html?id=${obj.id}" class="goule-goods-info-scroll">
						<div class="goule-goods-info-scroll-img-container">
							<img src = "${obj.firstImage}" />
						</div>
						<p class="goule-goods-info-scroll-describe">${obj.name}</p>
						<p class="goule-goods-info-scroll-price">${price}</p>
					</a>`
	return html;
}

function produceBaseInfo(data){
	var baseInfoContainer = $('.goule-goods-base-info-container'),
		properties = data.gdproperty.split(';');
		otherInfo = [];
	baseInfoContainer.append(addBaseInfo(data));
	if(data.post == 1){
		otherInfo.push({
			title:'运费',
			value:'包邮'
		})
	}
	else{
		otherInfo.push({
			title:'运费',
			value:'¥'+data.postprice.toFixed(2)
		})
	}
	otherInfo.push({
		title:'销量',
		value:num2tring(data.sales)
	});
	
	if(!(properties.length == 1 && properties[0] == '')){
		properties.map(function(obj){
			var arr = obj.split(':');
			otherInfo.push({
				title:arr[0],
				value:arr[1]
			})
		})
	}

	otherInfo.map(function(obj){
		baseInfoContainer.append(addInfoItem(obj));
	})
	
}
function addBaseInfo(data){
	var tprice = data.price.toFixed(2);
	var disprice = tprice;
	if (data.discount == 1) {
		disprice = (tprice * data.discountrate / 100).toFixed(2);
	}
	var html = `<div class="goule-goods-base-info"><p>${data.name}</p><p>`;
	if (disprice < tprice) {
		html += '<span style="color:black;text-decoration:line-through;margin-right: .2rem">¥' + tprice + '</span><span class="goule-goods-price">¥' + disprice + '</span>';
	} else {
        html += '<span class="goule-goods-price">¥' + tprice + '</span>';
	}
	html += `<span class="goule-goods-store">库存:${data.stock}</span></p></div>`
	return html;
}
function addInfoItem(obj){
	var html = `<div class="goule-goods-info-item">
					<p>${obj.title}</p>
					<p>${obj.value}</p>
				</div>`
	return html;
}
function produceThumbNail(thumbnail){
	var imgs = thumbnail.split(';'),
		swipeContainer = $('.sw-slides');
	imgs.map(function(obj,index){
		swipeContainer.append(addSwipeImg(obj));
	})
	
	$('#full_feature').css({
		'height':screen.width+'px'
	});
	setTimeout(function(){
		$('#full_feature').swipeslider({
		});
	},0)
}
function addSwipeImg(obj){
	var html = `<li class="sw-slide">
							<a>
								<img src="${obj}" alt="">
							</a>
						</li>`
	return html
}

function addShoppingCar(data){
	load.show();
	var name = data.name,
		price = data.price,
		img = data.firstImage,
		count = 1,
		id = data.id,
		item = JSON.parse(localStorage.getItem('Goods')),
		hasOne = false;
	if(!item){
		item = [];
	}
	item.map(function(obj){
		if(obj.id == id){
			hasOne = true;
		}
	})
	if(!hasOne){
	item.push({
		id:id,
		Img:img,
		goodsInfo:{
			title:name,
			singlePrice:price.toFixed(2)
		},
		count:count
	});
	localStorage.setItem('Goods',JSON.stringify(item));
	load.hide();
	hint.show('成功添加购物车');
	}else{
		load.hide();
		hint.show('购物车已存在该商品');
	}
}
function buyGoods(data){
	load.show();
	var name = data.name,
		price = data.price,
		img = data.firstImage,
		count = 1,
		id = data.id,
		item = [];
	//添加折扣处理
	if(data.discount == 1) {
	    price = price * data.discountrate / 100;
    }

	item.push({
		id:id,
		Img:img,
		goodsInfo:{
			title:name,
			singlePrice:price.toFixed(2)
		},
		count:count
	});
	localStorage.setItem('newOrder',JSON.stringify(item));
	load.hide();
	window.location.href =  "orderPage.html?orderType=0";
	
}

$(function(){
	pageInit();
})

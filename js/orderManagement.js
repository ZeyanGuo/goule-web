var userInfo = JSON.parse(localStorage.getItem('User')),
	page = 1,
	limit = 5,
	hasMore = true;
function getAJAXData(){
	load.show();
	var orderStatus = QueryString('orderStatus');
	$.ajax({
		type:"get",
		url:config.SERVER+"/getUserOrder",
		async:true,
		data:{
			userid:	userInfo.id,
			page:page,
			limit:limit,
			status:orderStatus,
			openid:userInfo.openid
		},
		success:function(data){
			load.hide();
			if(data.code == 1){
				renderPage(data.data);
			}
			else{
				hint.show(data.msg)
			}
		},
		error:function(){
			load.hide();
			hint.show('获取订单信息失败，请稍后重试');
		}
	});
}

function renderPage(data){
	
	if(data.length<limit){
		hasMore = false;
		$('.add-more').find('p').html('没有更多信息');
	}
	else{
		$('.add-more').find('p').html('点击加载更多');
		
	}
	var orderContainer =  $('.order-container');
	
	data.map(function(obj){
		orderContainer.append(addOrderItem(obj));
	})
	
}

function addOrderItem(obj){
	var time = new Date(obj.order.createtime).toLocaleString(),
		status,
		totalPrice = 0,
		goodName,
		goodPrice,
		goodCount,
		goodImg,
		totalCount = 0;
	
	switch(obj.order.odstatus){
		case -1:{
			status = '已取消';
		} break;
		case 0:{
			status = '待付款';
		} break;
		case 1:{
			status = '待发货';
		} break;
		case 2:{
			status = '已发货';
		} break;
		case 3:{
			status = '已完成';
		} break;
	}

	totalCount = obj.goods.length;
	goodCount = obj.goods[0].produce.goodnum;
	goodPrice = Number(obj.goods[0].produce.price).toFixed(2);
	goodName  = obj.goods[0].name;
	goodImg   = obj.goods[0].thumbnail; 
	totalPrice = obj.order.price;
	
	totalPrice = totalPrice.toFixed(2);
	
	
	var html = `<a href = "orderInfo.html?id=${obj.order.id}" class="goule-order-item">
			<div class="goule-order-title">
				<span class="goule-order-status">${status}</span>
				<div class="goule-order-price-container">
					<span >成交价：</span>
					<span class="goule-order-price">¥${totalPrice}</span>
				</div>
			</div>
			<div class="goule-order-info">
				<img src="${goodImg}" />
				<div class = "goule-order-info-container">
					<p class="goule-order-info-name">${goodName}</p>
					<p class="goule-order-info-price">¥${goodPrice}</p>
					<p class="goule-order-info-store">x${goodCount}</p>
				</div>
			</div>
			<div class="goule-order-other-info">
				<p>
					<span class = "goule-order-info-time">${time}</span>
					<span>共</span>
					<span class="goule-order-total-num">${totalCount}</span>
					<span>件商品</span>
				</p>
			</div>
		</a>`
	return html;
}

function initHeader(){
	var orderStatus = QueryString('orderStatus');
	switch(orderStatus){
		case '0':{
			$('#select_0').addClass('goule-order-nav-item-select');
		} break;
		case '1':{
			$('#select_1').addClass('goule-order-nav-item-select');
		} break;
		case '2':{
			$('#select_2').addClass('goule-order-nav-item-select');
		} break;
		case '3':{
			$('#select_3').addClass('goule-order-nav-item-select');
		} break;
		default:{
			
		}
	}
}

function initGetMore(){
	$('.add-more').on('click',function(){
		if(hasMore){
			page++;
			getAJAXData();
		}
	})
}

function initPage(){
	getAJAXData();
	initHeader();
	initGetMore();
}
$(function(){
	initPage();
})

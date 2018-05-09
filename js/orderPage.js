var dataStatic,addressId;

function getJSONValue(){
	var data = JSON.parse(localStorage.getItem('newOrder'));
	return data;
}

function checkOrder(){
	load.show()
	var 	userInfo = JSON.parse(localStorage.getItem('User')),
		orderInfo = JSON.parse(localStorage.getItem('newOrder')),
		goodids = [],
		goodnums = [],
		cinvoice = 0,
		remarks = "";
	if(!addressId){
		hint.show('请选择收获地址');
		load.hide();
		return;
	}
	
	orderInfo.map(function(obj){
		goodids.push(obj.id);
	})
	orderInfo.map(function(obj,index){
		goodnums.push(obj.count);
	})
	
	cinvoice = $('#cinvoice').val();
	
	remarks = $('#remarks').val();
	
	
	
	$.ajax({
		type:"get",
		url:config.SERVER+"/generateOrder",
		data:{
			userid:userInfo.id,
			remarks:remarks,
			cinvoice:cinvoice,
			goodids:goodids.join('a'),
			goodnums:goodnums.join('a'),
			addressid:addressId,
			openid:userInfo.openid
		},
		async:true,
		success:function(data){
			load.hide();
			if(data.code == 1){
				var data = data.data
				onBridgeReady({
					appId:data.appId,
					nonceStr	:data.nonceStr,
					packageinfo:data.packageinfo,
					paySign:data.paySign,
					signType:data.signType,
					timeStamp:data.timeStamp
				})
			}
		},
		error:function(err){
			load.hide();
			hint.show('订单生成失败，请稍后重试');
		}
	});
}

function renderOrder(data){
	var itemContainer = $('.goule-order-base-info-container'),
		totalPrice = 0;
	data.map(function(obj){
		itemContainer.append(addItem(obj));
		totalPrice += Number(obj.count)*Number(obj.goodsInfo.singlePrice)
	})
	
	$('#total-order-price').html('¥'+totalPrice.toFixed(2));
	
}

function addItem(obj){
	var price = Number(obj.goodsInfo.singlePrice).toFixed(2),
		totalPrice = (Number(obj.count)*Number(obj.goodsInfo.singlePrice)).toFixed(2)
		html = `<div class="goule-order-base-info">
						<img src="${obj.Img}" />
						<div class="goule-order-goods-baseInfo">
							<p class="goule-order-goods-name">${obj.goodsInfo.title}</p>
							<div class="goule-order-goods-num-component" data-tag = ${obj.id}>
								<i class="iconfont1" data-tag = "decrease">&#xe643;</i>
								<span class="number-input">${obj.count}</span>
								<i class="iconfont1" data-tag = "increase">&#xe641;</i>
							</div>
							<p class="goule-order-goods-price">¥${price}</p>
							<p class="goule-order-goods-price goule-order-goods-totalprice" style="font-size:.2rem">小计 ¥${totalPrice}</p>
						</div>
					</div>`
	return html;
}

function initNumSelect(){
	$('.goule-order-goods-num-component').on('tap',function(e){
		var tag = $(e.target).attr('data-tag'),
			id = $(this).attr('data-tag');
		if(tag == 'decrease'){
			
			dataStatic = dataStatic.map(function(obj){
				if(obj.id == id){
					if(obj.count > 1){
						obj.count = Number(obj.count)-1;
					}
				}
				return obj;
			})
		}
		else if(tag == 'increase'){
			dataStatic = dataStatic.map(function(obj){
				if(obj.id == id){
					obj.count = Number(obj.count)+1;
				}
				return obj;
			})
		}
		localStorage.setItem('newOrder',JSON.stringify(dataStatic));
		changeInput();
		calculatePrice();
	});
}

function changeInput(){
	dataStatic.map(function(obj){
		$('[data-tag='+obj.id+']').find('.number-input').html(obj.count);
	})
}
function calculatePrice(){
	var totalPrice = 0;
	dataStatic.map(function(obj){
		var price ='小计 ¥' + (Number(obj.count)*Number(obj.goodsInfo.singlePrice)).toFixed(2)
		$('[data-tag='+obj.id+']').siblings('.goule-order-goods-totalprice').html(price);
		totalPrice += Number(obj.count)*Number(obj.goodsInfo.singlePrice);
	});
	$('#total-order-price').html('¥'+totalPrice.toFixed(2));
}

function addressSelect(e){
	var target = e.target;
		container = $(target).parents('.goule-order-post-place-item');
		addressId = container.attr('data-id');
	container.find('.goule-post-select').addClass('goule-post-select-checked');
	container.siblings('.goule-order-post-place-item').find('.goule-post-select').removeClass('goule-post-select-checked');
}

function initAddress(){
	var userInfo = JSON.parse(localStorage.getItem('User'));
	$('#add-new-address').on('tap',function(){
		window.location.href = 'deliveryAddress.html?from=orderPage';
	});
	$('.goule-order-post-place-container').on('tap',addressSelect);
	$.ajax({
		type:'GET',
		url:config.SERVER+'/getUserAddress',
		data:{
			userid:userInfo.id,
			openid:userInfo.openid
		},
		success:function(data){
			initAddressContainer(data.data);
		},
		error:function(){
			
		}
	})
}

function initAddressContainer(data){
	var addressContainer = $('.goule-order-post-place-container');
	if(data.length > 0){
		$('.goule-order-post-place-none').hide();
		data.map(function(obj){
			addressContainer.append(addAddress(obj));
		})
	}
}

function addAddress(obj){
	var phone = obj.phone,checked = "";
	if(obj.status == 1){
		addressId = obj.id;
		checked = 'goule-post-select-checked';
	}
	var	html = `<div class = "goule-order-post-place-item" data-id = ${obj.id}>
						<i class="goule-post-select ${checked}"></i>
						<div class="goule-post-info">
							<p>${obj.receptor}</p>
							<p>${obj.detail}</p>
							<p>${phone}</p>
						</div>
					</div>`
	return html;
}


function initPage(){
	var orderType = QueryString('orderType'),data;
//	if(orderType == '0'){//订单修改，确认订单阶段
//		$('#final-method').html('确认订单');
setTimeout(function(){
		$('.goule-order-pay-footer').on('tap',checkOrder);
},1000);
//	}
	dataStatic = getJSONValue();
	renderOrder(dataStatic);
	initNumSelect();
	initAddress();
}

function initKeyBorad(){
	var spanTarget,
		id;
	$('.number-input').on('click',function(e){
		spanTarget = e.target;
		id = $(spanTarget).parents('.goule-order-goods-num-component').attr('data-tag');
		$('.layer-content').animate({
			bottom: 0
		}, 200)
		e.stopPropagation();
	})
	$('.layer-content').on('click',function(e){
		e.stopPropagation();
	})
	$('body').on('click',function(){
		if(spanTarget.innerHTML == ''){
			spanTarget.innerHTML = 1;
		}
		$('.layer-content').animate({
			bottom: '-200px'
		}, 200);
		
		dataStatic = dataStatic.map(function(obj){
			if(obj.id == id){
				obj.count = spanTarget.innerHTML;
			}
			return obj;
		})
		
		localStorage.setItem('newOrder',JSON.stringify(dataStatic));
		changeInput();
		calculatePrice();
	});
	$('.form_edit .num').click(function(){
		var value = spanTarget.innerHTML+this.innerHTML;
		if(value<=999){
			spanTarget.innerHTML = value;
		}
	})
	$('#remove').click(function(){
		var oDivHtml = spanTarget.innerHTML;
		spanTarget.innerHTML = oDivHtml.substring(0,oDivHtml.length-1);
		

	})
}

$(function(){
	initPage();
	initKeyBorad();
})


//-------微信支付接口--------

function onBridgeReady(data){
   WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId":data.appId,     //公众号名称，由商户传入     
           "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
           "nonceStr":data.nonceStr, //随机串     
           "package":data.packageinfo,     
           "signType":data.signType,         //微信签名方式：     
           "paySign":data.paySign //微信签名 
       },
       function(res){
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
           	hint.show('微信支付成功');
           	setTimeout(function(){
           		window.location.href = "orderManagement.html?orderStatus=1";
           	},1000);
           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
           else{
           	hint.show('微信支付失败');
           	setTimeout(function(){
           		window.location.href = "orderManagement.html?orderStatus=0";
           	},1000);
           }
       }
   ); 
}
//if (typeof WeixinJSBridge == "undefined"){
// if( document.addEventListener ){
//     document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
// }else if (document.attachEvent){
//     document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
//     document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
// }
//}else{
//	
// onBridgeReady();
//}
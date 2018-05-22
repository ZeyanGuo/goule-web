var dataStatic,addressId,nonceStr,timestamp,postPrice;

function getJSONValue(){
	var data = JSON.parse(localStorage.getItem('newOrder'));
	return data;
}

function deleteShoppingCar(ids){
	
	var shoppingInfo = JSON.parse(localStorage.getItem('Goods')),
		newShoppingGoods = [];
	
	if(!!shoppingInfo){
		ids.map(function(obj){
			for(var i = 0;i < shoppingInfo.length; i++){
				if(shoppingInfo[i].id == obj){
					shoppingInfo.splice(i,1);
					break;
				}
			}
		});
	localStorage.setItem('Goods',JSON.stringify(shoppingInfo));
	}
}

function checkOrder(){
	load.show()
	var 	userInfo = JSON.parse(localStorage.getItem('User')),
		orderInfo = JSON.parse(localStorage.getItem('newOrder')),
		goodids = [],
		goodnums = [],
		cinvoice = 0,
		remarks = "",
		sendData;
	
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
	sendData  = {
		userid:userInfo.id,
		remarks:remarks,
		cinvoice:cinvoice,
		goodids:goodids.join('a'),
		goodnums:goodnums.join('a'),
		addressid:addressId,
		openid:userInfo.openid
	}
	if(!!QueryString('orderId')){
		sendData.oldid = QueryString('orderId');
	}
	sendData.timeStamp = timestamp;
	sendData.nonceStr = nonceStr;
	$.ajax({
		type:"get",
		url:config.SERVER+"/generateOrder",
		data:sendData,
		async:true,
		success:function(data){
			load.hide();
			
			if(data.code == 1){
				var data = data.data;
				deleteShoppingCar(goodids);
				
				pay(data);
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
	});
	if(totalPrice<60){
		$('#sendPrice').html(postPrice+'元(单次购物满60元包邮)');
		totalPrice += Number(postPrice);
	}
	else{
		$('#sendPrice').html('包邮');
	}
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
	if(totalPrice<60){
		$('#sendPrice').html(postPrice+'元(单次购物满60元包邮)');
		totalPrice += postPrice;
	}
	else{
		$('#sendPrice').html('包邮');
	}
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
	load.show();
	dataStatic = getJSONValue();
	$.ajax({
		type:"get",
		url:config.SERVER + "/getPostprice",
		async:true,
		data:{
			xtoken:xtoken
		},
		success:function(data){
			load.hide();
			postPrice = data.data;
			renderOrder(dataStatic);
			initNumSelect();
			initAddress();
		},
		error:function(){
			load.hide();
			hint.show('获取商品数据失败');
		}
	});
	
}

function initKeyBorad(){
	var spanTarget,
		id;
	$('.number-input').on('tap',function(e){
		spanTarget = e.target;
		id = $(spanTarget).parents('.goule-order-goods-num-component').attr('data-tag');
		$('.layer-content').animate({
			bottom: 0
		}, 200)
		e.stopPropagation();
	})
	$('.layer-content').on('tap',function(e){
		e.stopPropagation();
	})
	$('body').on('tap',function(){
		if(!!spanTarget){
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
		}
	});
	$('.form_edit .num').on('tap',function(){
		var value = spanTarget.innerHTML+this.innerHTML;
		if(value<=999){
			spanTarget.innerHTML = value;
		}
	})
	$('#remove').on('tap',function(){
		var oDivHtml = spanTarget.innerHTML;
		spanTarget.innerHTML = oDivHtml.substring(0,oDivHtml.length-1);
		

	})
}

$(function(){
	console.log(localStorage.getItem('Goods'));
	initPage();
	initKeyBorad();
	initPay();
	
})


//-------微信支付接口--------

function initPay(){
	
	$.ajax({
		type:'get',
		url:config.SERVER+'/generatePageConfig',
		data:{
			url:location.href
		},
		success:function(data){
			var data = data.data;
			nonceStr = data.nonceStr;
			timestamp = data.timestamp;
			 wx.config({  
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                appId: data.appId, // 必填，公众号的唯一标识  
                timestamp: data.timestamp, // 必填，生成签名的时间戳  
                nonceStr: data.nonceStr, // 必填，生成签名的随机串  
                signature: data.signature.toLowerCase(), // 必填，签名，见附录1  
                jsApiList: [  
                        "chooseWXPay"  
                    ] // 所有要调用的 API 都要加到这个列表中  
            });  
            
		}
	})
}
function pay(data){   
	
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  
    wx.chooseWXPay({
        appId: data.appId,  
        timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位  
        package: data.packageinfo, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
        paySign: data.paySign, // 支付签名  
        success: function(res) { 
        	
            // 支付成功后的回调函数  
            if (res.errMsg == "chooseWXPay:ok") {  
                //支付成功  
                	hint.show('微信支付成功');
	           	setTimeout(function(){
	           		window.location.href = "orderManagement.html?orderStatus=1";
	           	},1000);
            } else {  
            		
                hint.show(res.errMsg);  
            }  
        },  
        cancel: function(res) {  
            //支付取消  
            	hint.show('微信支付失败');
           	setTimeout(function(){
           		window.location.href = "orderManagement.html?orderStatus=0";
           	},1000);
        }  
    });   
}

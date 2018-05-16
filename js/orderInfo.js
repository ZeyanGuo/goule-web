var userInfo = JSON.parse(localStorage.getItem('User')),
	timestamp,nonceStr;
function getAjaxData(){
	load.show();
	var id = QueryString('id');
	$.ajax({
		type:'GET',
		url:config.SERVER + '/getOrderDetail',
		data:{
			orderid:id,
			openid:userInfo.openid
		},
		async:true,
		success:function(data){
			load.hide();
			if(data.code == 1){
				renderPage(data.data);
			}else{
				hint.show(data.msg);
			}
		},
		error:function(err){
			load.hide();
			hint.show('获取数据失败，请稍后重试')
		}
	})
}

function renderPage(data){
	var goodsContainer = $('.goule-order-base-info-container');
	data.goods.map(function(obj){
		goodsContainer.append(addGoods(obj))
	});
	initImgClick();
	renderOther(data)
}

function addGoods(obj){
	var singlePrice =obj.produce.price.toFixed(2),
		totalPrice = (Number(obj.produce.price)*Number(obj.produce.goodnum)).toFixed(2);
	var html = `<div class="goule-order-base-info" data-id = "${obj.produce.goodid}">
						<img src="${obj.thumbnail}" />
						<div class="goule-order-goods-baseInfo">
							<p class="goule-order-goods-name">${obj.name}</p>
							
							<p class="goule-order-goods-price">¥${singlePrice}</p>
							<p class="goule-order-goods-price goule-order-goods-totalprice" style="font-size:.2rem">小计 ¥${totalPrice}<span style = "font-size:.2rem;color:black;float:right;padding-right:.2rem">x${obj.produce.goodnum}</span></p>
						</div>
					</div>`
	return html;
}

function renderOther(obj){
	var status,
		operation,
		cinvoice,
		totalPrice = 0,
		checkArray = {
				'SF':'顺丰速运',
				'HTKY':'百世快递',
				'ZTO':'中通快递',
				'STO':'申通快递',
				'YTO':'圆通速递',
				'YD':'韵达速递',
				'YZPY':'邮政快递包裹',
				'EMS':'EMS',
				'HHTT':'天天快递',
				'JD':'京东物流',
				'UC':'优速快递',
				'DBL':'德邦',
				'FAST':'快捷快递',
				'ZJS':'宅急送',
				'TNT':'TNT快递',
				'UPS':'UPS',
				'DHL':'DHL',
				'FEDEX':'FEDEX联邦'
			};
		
	switch(obj.order.odstatus){
		case -1:{
			status = '已取消';
			$('.goule-order-pay-footer').hide();
		} break;
		case 0:{
			status = '待付款';
			operation = '重新购买';
			initPay();
			$('#aboutPay').on('tap',function(){
				reBuy(obj);
			});
			$('.post-info').hide();
		} break;
		case 1:{
			status = '待发货';
			$('.post-info').hide();
			$('.goule-order-pay-footer').hide();
		} break;
		case 2:{
			status = '已发货';
			$('#checkLogistics').show();
			operation = '确认收货';
			$('#aboutPay').on('tap',sureRecieved);
			$('#checkLogistics').on('tap',checkLogistics);
		} break;
		case 3:{
			status = '已完成';
			$('.goule-order-pay-footer').hide();
		} break;
	}
	$('#aboutPay').html(operation);
	$('#orderStatus').html(status);
	
	$('#recieper').html(obj.address.receptor);
	$('#address').html(obj.address.detail);
	$('#phone').html(obj.address.phone);
	
	if(!!obj.order.posttype){
		$('#postType').html(checkArray[obj.order.posttype]);
		$('#postID').html(obj.order.postid);
	}
	if(obj.order.cinvoice == 0){
		cinvoice = '否';
	}
	else{
		cinvoice = '是';
	}
	$('#cinvoice').html(cinvoice);
	$('#remark').val(obj.order.remarks);
	
	
	totalPrice = obj.order.price;
	if(totalPrice<60){
		$('#sendPrice').html('5元');
	}
	else{
		$('#sendPrice').html('包邮');
	}
	$('#total-order-price').html('¥'+totalPrice.toFixed(2));
	
	
	function reBuy(data){
		
		load.show();
		var goodids = data.goods.map(function(obj){
				return obj.produce.goodid;
			}),
			goodnums = data.goods.map(function(obj){
				return obj.produce.goodnum;
			}),
			sendData = {
				userid:userInfo.id,
				remarks:data.order.remarks,
				cinvoice:data.order.cinvoice,
				goodids:goodids.join('a'),
				goodnums:goodnums.join('a'),
				addressid:data.order.addressid,
				openid:userInfo.openid,
				oldid: data.order.id
			};
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
					
					pay(data);
				}
			},
			error:function(err){
				load.hide();
				hint.show('订单生成失败，请稍后重试');
			}
		});
		
	}
	
	function sureRecieved(){
		load.show();
		var userInfo = JSON.parse(localStorage.getItem('User')); 
		$.ajax({
			type:"get",
			url:config.SERVER + "/setOrderFinished",
			async:true,
			data:{
				orderid:obj.order.id,
				userid:userInfo.id,
				openid:userInfo.openid
			},
			success:function(data){
				load.hide();
				if(data.code == 1){
					hint.show('操作成功')
					setTimeout(function(){
						window.location.href = 'orderManagement.html?orderStatus=3';
					},500)
				}else{
					hint.show(data.msg);
				}
			},
			error:function(){
				load.hide();
				hint.show('确认失败，请稍后重试')
			}
		});
	}
	
	function checkLogistics(){
		window.location.href = 'checkLogistics.html?id='+ obj.order.id;
	}
	
}

function initImgClick(){
	$('.goule-order-base-info').on('tap',function(e){
		
		var target = e.target;
		if(target.nodeName == 'IMG'){
			window.location.href = 'goodsInformation.html?id='+$(this).attr('data-id');
		}
	})
}

function initPage(){
	getAjaxData();
	
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

$(function(){
	initPage()
})

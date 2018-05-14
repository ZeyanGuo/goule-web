var userInfo = JSON.parse(localStorage.getItem('User'));
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
	var singlePrice =obj.produce.price,
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
			$('#aboutPay').on('tap',reBuy);
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
	$('#total-order-price').html('¥'+totalPrice);
	
	
	function reBuy(){
		load.show();
		var goods = [];
		obj.goods.map(function(data){
			goods.push({
				Img:data.thumbnail,
				count:data.produce.goodnum,
				id:data.produce.goodid,
				goodsInfo:{
					singlePrice:data.produce.price,
					title:data.name
				}
			})
		})
		localStorage.setItem('newOrder',JSON.stringify(goods));
		load.hide();
		window.location.href = "orderPage.html?orderId="+QueryString('id');
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

$(function(){
	initPage()
})

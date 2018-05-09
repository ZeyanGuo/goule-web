var userInfo = JSON.parse(localStorage.getItem('User'));
function pageInit(){
	load.show();
	var orderId = QueryString('id');
	$.ajax({
		type:"get",
		url: config.SERVER+"/getLogisticInfo",
		async:true,
		data:{
			orderid:	orderId,
			openid:userInfo.openid
		},
		success:function(data){
			load.hide();
			if(data.code == 1){
				if(data!=''){
					renderData(data.data);
				}else{
					$('.goule-logistics-none').show();
				}
			}
			else{
				hint.show(data.msg);
			}
		},
		error:function(err){
			load.hide();
			hint.show('物流信息获取失败，请稍后重试');
		}
	});
}

function renderData(data){
	var data = JSON.parse(data),
		traces = data.Traces,
		addressContainer = $('.goule-logistics'),
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
	
	$('#postId').html(data.LogisticCode);
	$('#postType').html(checkArray[data.ShipperCode])
	
	for(var i = traces.length - 1; i >= 0;i--){
		addressContainer.append(addItem(traces[i]));
		if(i!=0){
			addressContainer.append(addLink());
		}
	}
	
}
function addLink(){
	var html = `<div class="goule-logistics-link">
				<div class="link"></div>
			</div>`
	return html;
}

function addItem(obj){
	var time = obj.AcceptTime.split(' ');
	var html = `<div class="goule-logistics-step">
				<div class="goule-logistics-time">
					<div class="flex">
						<p class="hour-minute">${time[1]}</p>
						<p class="month-day">${time[0]}</p>
					</div>
				</div>
				<div class="goule-logistics-discrible">
					<div class="flex">
						<p>${obj.AcceptStation}</p>
					</div>
				</div>
			</div>`
	return html;
}

$(function(){
	pageInit();
})

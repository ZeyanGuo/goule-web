/*
 **
 
 地址管理页面JS代码
 
  
 **
*/
var userInfo = JSON.parse(localStorage.getItem('User')),
	edit = false;
function initPage(){
	$('#add-new-address').on('tap',function(){
		window.location.href = 'deliveryAddress.html?from=addressManagement';
	})
	load.show();
	$.ajax({
		type:"get",
		url:config.SERVER + "/getUserAddress",
		data:{
			userid:userInfo.id,
			openid:userInfo.openid
		},
		async:true,
		success:function(data){
			load.hide();
			initAddress(data.data);
		},
		error:function(){
			load.hide();
			hint.show('获取用户地址失败，请稍后重试')
		}
	});
}

function initAddress(data){
	var addressContainer = $('.goule-shopping-container');
	$('#editBtn').on('tap',function(){
		if(edit){
			location.reload();
		}
		else{
			edit = true;
			$(this).css('color','green');
			$(this).find('.goule-shopping-edit').html('完成');
			$('.goule-address-item-operation').hide();
			$('.red').show();
		}
	})
	if(data.length == 0){
		addressContainer.hide();
		$('.goule-shopping-noGoods').show();
		return;
	}
	addressContainer.on('tap',operationBtnTap);
	data.map(function(obj){
		addressContainer.append(addAddress(obj));
	})
}

function addAddress(data){
	var garyBtn,greenBtn;
	if(data.status == 0){
		garyBtn = 'none';
		greenBtn = "inline-block";
	}
	else{
		garyBtn = 'inline-block';
		greenBtn = 'none';
	}
	var html = `<div class = "goule-address-item" data-id = "${data.id}">
				<div class="goule-address-item-info">
					<p>${data.receptor}</p>
					<p>${data.detail}</p>
					<p>${data.phone}</p>
				</div>
				<div class="goule-address-item-operation gray" style="display: ${garyBtn};">
					<p>默认地址</p>
				</div>
				<div class="goule-address-item-operation green" data-tag = "setDefault" style="display: ${greenBtn};">
					<p>设为默认</p>
				</div>
				<div class="goule-address-item-operation red" data-tag = "delete" style="display: none">
					<p>删除</p>
				</div>
			</div>`
	return html;
}

function setDefaultPageAction(target){
	$(target).hide();
	$(target).siblings('.gray').show();
	var others = $(target).parents('.goule-address-item').siblings('.goule-address-item');
	others.find('.gray').hide();
	others.find('.green').show();
}

function deletePageAction(id){
	$('[data-id='+id+']').remove();
	
}

function operationBtnTap(e){
	var target = $(e.target).parent(),
		tag = $(target).attr('data-tag');
	if(tag == 'setDefault'){
		var id = getAddressId(target);
		load.show();
		$.ajax({
			type:"GET",
			url:config.SERVER+"/setDefaultAddress",
			data:{
				userid:userInfo.id,
				addressid:id,
				openid:userInfo.openid
			},
			async:true,
			success:function(data){
				load.hide();
				if(data.code == 1){
					setDefaultPageAction(target);
				}
				else{
					hint.show(data.msg);
				}
			},
			error:function(){
				load.hide();
				hint.show('设置默认地址失败，请检查网络设置');
			}
		});
	}
	else if(tag == 'delete'){
		var id = getAddressId(target);
		load.show();
		$.ajax({
			type:"GET",
			url:config.SERVER+"/deleteAddress",
			data:{
				addressid:id,
				openid:userInfo.openid
			},
			async:true,
			success:function(data){
				load.hide();
				if(data.code == 1){
					deletePageAction(id);
				}
				else{
					hint.show(data.msg);
				}
			},
			error:function(){
				load.hide();
				hint.show('删除地址失败，请检查网络设置');
			}
		});
	}
	
	function getAddressId(target){
		return $(target).parents('.goule-address-item').attr('data-id');
	}
}


$(function(){
	initPage();
})

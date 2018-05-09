/*
 **
 
 购物车页面JS代码
 
  
 **
*/

var baseInfo = {
		edit:false,
		select:{
			goods:false,
			edit:false
		},
		submitbool:{
			goods:false,
			edit:false
		}
	},
	goodsBackInfo = {}

function deleteLocalStorage(id){
	var Goods = JSON.parse(localStorage.getItem('Goods')),
		newStorage = [];
	
	Goods.map(function(obj){
		if(obj.id != id){
			newStorage.push(obj);
		}
	});
	
	localStorage.setItem('Goods',JSON.stringify(newStorage));
	
	
	
}

function goodsDelete(e){
	e.stopPropagation();
	var tag = $(this).parents('.goule-shopping-item').attr('data-tag');
	function cancle(){
		
	}
	function comfirm(){
		load.show();
		delete goodsBackInfo[tag];
		$('[data-tag='+tag+']').remove();
		deleteLocalStorage(tag);
		load.hide();
		if(attributeCount(goodsBackInfo) === 0){
			pageInit({
				goods:[]
			});
		}
		else{
			checkSelected();
		}
	}
	showComfirm('确定删除该数据？',cancle,comfirm);
	
}

function deleteAll(e){
	e.stopPropagation();
	function cancle(){
		
	}
	function comfirm(){
		load.show();
		for(var key in goodsBackInfo){
			if(goodsBackInfo[key].select.edit){
				var tag = key;
				delete goodsBackInfo[key];
				deleteLocalStorage(tag);
				$('[data-tag='+tag+']').remove();
			}
		}
		load.hide();
		if(attributeCount(goodsBackInfo) === 0){
			pageInit({
				goods:[]
			});
		}
		else{
			checkSelected();
		}
	}
	
	showComfirm('确定删除选定数据？',cancle,comfirm);
}

function getJSONValue(){
	
	var store = JSON.parse(localStorage.getItem('Goods'));
	if(!store){
		store = [];
	}
	return {
		goods:store
	}

}

function goodsItemClick(e){
	var id = $(this).attr('data-tag'),
		operateTarget = baseInfo.edit?'edit':'goods',
		target = e.target;
	if(target.nodeName == 'IMG'){
		window.location.href = 'goodsInformation.html?id='+$(this).attr('data-tag');
		return;
	}
	
	if(!goodsBackInfo[id].select[operateTarget]){
		goodsBackInfo[id].select[operateTarget] = true;
		$(this).children('.goule-shopping-checkbox').addClass('goule-shopping-checkbox-ok');
	}
	else{
		goodsBackInfo[id].select[operateTarget] = false;
		$(this).children('.goule-shopping-checkbox').removeClass('goule-shopping-checkbox-ok');
	}
	
	checkSelected();
	if(!baseInfo.edit){
		calculatePrice();
	}
}

function checkSelected(){
	var operateTarget = baseInfo.edit?'edit':'goods',
		allSelect = true,
		count = 0;
	for(var obj in goodsBackInfo){
		if(!goodsBackInfo[obj].select[operateTarget]){
			allSelect = false;
		}
		else{
			count++;
		}
	}
	if(allSelect){
		baseInfo.select[operateTarget] = true;
		$('.goule-shopping-checkbox-all').addClass('goule-shopping-checkbox-ok');
	}
	else{
		baseInfo.select[operateTarget] = false;
		$('.goule-shopping-checkbox-all').removeClass('goule-shopping-checkbox-ok');
	}
	if(!baseInfo.edit){
		if(count>0){
			$('.goule-shopping-operation').removeClass('goule-shopping-operation-disable');
			$('.goule-shopping-goods-count').html('('+count+')');
			baseInfo.submitbool[operateTarget] = true;
		}
		else{
			$('.goule-shopping-operation').addClass('goule-shopping-operation-disable');
			$('.goule-shopping-goods-count').html('');
			baseInfo.submitbool[operateTarget] = false;
		}
	}
	else{
		if(count>0){
			$('.goule-shopping-operation').removeClass('goule-shopping-operation-disable');
			baseInfo.submitbool[operateTarget] = true;
		}
		else{
			$('.goule-shopping-operation').addClass('goule-shopping-operation-disable');
			baseInfo.submitbool[operateTarget] = false;
		}
	}
}

function calculatePrice(){
	var totalPrice = 0;
	for(var obj in goodsBackInfo){
		$('[data-tag='+obj+']').find('.small-text-price').html('小计 '+ Number(goodsBackInfo[obj].totalPrice).toFixed(2))
		if(goodsBackInfo[obj].select.goods){
			totalPrice += Number(goodsBackInfo[obj].totalPrice);
		}
	}
	
	$('#price').html("¥"+totalPrice.toFixed(2));
}

function allSelect(){
	var operateTarget = baseInfo.edit?'edit':'goods';
	if(!baseInfo.select[operateTarget]){
		baseInfo.select[operateTarget] = true;
		for(var obj in goodsBackInfo){
			goodsBackInfo[obj].select[operateTarget] = true;
		}
		$('.goule-shopping-checkbox').addClass('goule-shopping-checkbox-ok');
	}
	else {
		baseInfo.select[operateTarget] = false;
		for(var obj in goodsBackInfo){
			goodsBackInfo[obj].select[operateTarget] = false;
		}
		$('.goule-shopping-checkbox').removeClass('goule-shopping-checkbox-ok');
	}
	if(!baseInfo.edit){
		calculatePrice();
	}
	checkSelected();
}

function editBtnClick(e){
	e.stopPropagation();
	var editSpan = $('#editBtn span'),
		editBtn = $('#editBtn'),
		finishText = $('.goule-shopping-finish'),
		deleteText = $('.goule-shopping-delete'),
		price = $('.goule-shopping-price'),
		goodsEditOperations = $('.goule-shopping-edit-container');
		goodsInformations = $('.goule-shopping-main-container');
	if(!baseInfo.edit){//点击编辑
		baseInfo.edit = true;
		editSpan.html('完成');
		editBtn.addClass('goule-shopping-edit-select');
		finishText.hide();
		deleteText.show();
		price.hide();
		goodsEditOperations.show();
		goodsInformations.hide();
	}
	else{//点击完成
		baseInfo.edit = false;
		editSpan.html('编辑');
		editBtn.removeClass('goule-shopping-edit-select');
		finishText.show();
		deleteText.hide();
		price.show();
		goodsEditOperations.hide();
		goodsInformations.show();
		editCompelated();
		checkSelected();
		localStoreEdit();
	}
	editChangeInit();
}
function localStoreEdit(){
	console.log(goodsBackInfo);
	var newStore = [];
	for(var key in goodsBackInfo){
		newStore.push({
			id:key,
			count:goodsBackInfo[key].count,
			Img:goodsBackInfo[key].Img,
			goodsInfo:{
				singlePrice:goodsBackInfo[key].singlePrice,
				title:goodsBackInfo[key].name
			}
		});
	}
	localStorage.setItem('Goods',JSON.stringify(newStore));
}

function editCompelated(){
	var shoppingItems = $('.goule-shopping-item').each(function(){
		var obj = $(this),
			tag = obj.attr('data-tag'),
			newCount = obj.find('.goodsNum').html();
		if(newCount == ''){
			newCount = 1;
			obj.find('.goodsNum').html(1);
		}
		obj.find('.goule-shopping-item-num').html('x'+newCount);
		
		goodsBackInfo[tag].count = newCount;
		goodsBackInfo[tag].totalPrice = new Number(Number(goodsBackInfo[tag].singlePrice)*Number(goodsBackInfo[tag].count)).toFixed(2);
		calculatePrice();
	})

}

function produceGood(data){
	var titleValue = data.goodsInfo.title,
		price = data.goodsInfo.singlePrice,
		totalPrice = new Number(Number(data.goodsInfo.singlePrice)*Number(data.count)).toFixed(2),
		Img = data.Img,
		count = data.count,
		id = data.id,
	 	template = `<div class="goule-shopping-item" data-tag = "${id}">
				<i class="goule-shopping-checkbox"></i><!-- goule-shopping-checkbox-ok -->
				<img src="${Img}" />
				<div class="goule-shopping-item-text">
					<div class = "goule-shopping-edit-container" style="display: none;" >
						<div class = "goule-shopping-item-num-editor" >
							<i class="iconfont1 decrease">&#xe643;</i>
							<span class = "goodsNum">${count}</span>
							<i class="iconfont1 increase">&#xe641;</i>
						</div>
						
						<div class = "goule-shopping-item-delete">
							<p>删除<p>
						</div>
					</div>
					<div class = "goule-shopping-main-container">
						<p class = "goule-shopping-item-title">${titleValue}</p>
						<p class = "goule-shopping-item-price">¥${price}</p>
						<p class = "goule-shopping-item-price small-text-price">小计 ${totalPrice}</p>
						<p class = "goule-shopping-item-num">x${count}</p>
					</div>
				</div>
			</div>`
	 	return template;
}

function editChangeInit(){
	var operateTarget = 	baseInfo.edit?'edit':'goods';
	$('.goule-shopping-checkbox').removeClass('goule-shopping-checkbox-ok');
	for(var obj in goodsBackInfo){

		if(goodsBackInfo[obj].select[operateTarget]){
			$('[data-tag='+obj+']').children('.goule-shopping-checkbox').addClass('goule-shopping-checkbox-ok');
		}
		else{
			$('[data-tag='+obj+']').removeClass('goule-shopping-checkbox-ok');
		}
	}
	if(baseInfo.select[operateTarget]){
		$('.goule-shopping-checkbox-all').addClass('goule-shopping-checkbox-ok');
	}
	else{
		$('.goule-shopping-checkbox-all').removeClass('goule-shopping-checkbox-ok');
	}
	if(baseInfo.submitbool[operateTarget]){
		$('.goule-shopping-operation').removeClass('goule-shopping-operation-disable');
	}
	else{
		$('.goule-shopping-operation').addClass('goule-shopping-operation-disable');
	}
}

function pageInit(data){
	var data = data?data:getJSONValue();
	$('#editBtn').on('tap',editBtnClick);
	if(data.goods.length > 0){
		data.goods.map(function(obj){
			var template = produceGood(obj);
			$('.goule-shopping-container').append(template);
			goodsBackInfo[obj.id] = {
				select:{
					goods:false,
					edit:false
				},
				Img:obj.Img,
				name:obj.goodsInfo.title,
				count:obj.count,
				singlePrice:obj.goodsInfo.singlePrice,
				totalPrice:new Number(Number(obj.goodsInfo.singlePrice)*Number(obj.count)).toFixed(2),
			}
		})
		$('.goule-shopping-item').on('tap',goodsItemClick);
		$('.goule-shopping-select').on('tap',allSelect);
		$('.goule-shopping-item-delete').on('tap',goodsDelete);
		$('.goule-shopping-delete').on('tap',deleteAll);
	}
	else{
		$(".goule-shopping-noGoods").show();
		$(".goule-shopping-container").hide();
		$('.goule-shopping-footer').hide()
	}
	
}

function initBuyNow(){
	$('.goule-shopping-finish').on('tap',function(){
		load.show();
		var count = 0,newOrder = [];
		for(var key in goodsBackInfo){
			if(goodsBackInfo[key].select.goods == true){
				count++;
				newOrder.push({
					id:key,
					count:goodsBackInfo[key].count,
					Img:goodsBackInfo[key].Img,
					goodsInfo:{
						singlePrice:goodsBackInfo[key].singlePrice,
						title:goodsBackInfo[key].name
					}
				});
				
			}
		}
		if(count>0){
			localStorage.setItem('newOrder',JSON.stringify(newOrder));
			load.hide();
			window.location.href = "orderPage.html?orderType=0"
		}
	})
}

function initKeyBorad(){
	var spanTarget;
	$('.goodsNum').on('click',function(e){
		spanTarget = e.target;
		$('.layer-content').animate({
			bottom: 0
		}, 200)
		e.stopPropagation();
	})
	$('.layer-content').on('tap',function(e){
		e.stopPropagation();
	})
	$('body').on('tap',function(){
		if(spanTarget.innerHTML == ''){
			spanTarget.innerHTML = 1;
		}
		$('.layer-content').animate({
			bottom: '-200px'
		}, 200)
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
	pageInit();
	initBuyNow();
	initKeyBorad()
})

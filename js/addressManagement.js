/*
 **
 
 地址管理页面JS代码
 
  
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


function goodsDelete(e){
	e.stopPropagation();
	var tag = $(this).parents('.goule-shopping-item').attr('data-tag');
	function cancle(){
		
	}
	function comfirm(){
		delete goodsBackInfo[tag];
		$('[data-tag='+tag+']').remove();
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
		for(var key in goodsBackInfo){
			if(goodsBackInfo[key].select.edit){
				var tag = key;
				delete goodsBackInfo[key];
				$('[data-tag='+tag+']').remove();
			}
		}
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
	
	return {
		goods:[
			{
				id:"1",
				Img:'img/testImg/item.jpeg',
				goodsInfo:{
					title:'【重庆】熊出没儿童专款蛋糕 中国国际儿童电影节指定蛋糕品牌',
					singlePrice:'337.00'
				},
				count:1
			},
			{
				id:"2",
				Img:'img/testImg/item.jpeg',
				goodsInfo:{
					title:'【重庆】熊出没儿童专款蛋糕 中国国际儿童电影节指定蛋糕品牌',
					singlePrice:'337.00'
				},
				count:3
			}
		]
	}

}

function goodsItemClick(){
	var id = $(this).attr('data-tag'),
		operateTarget = baseInfo.edit?'edit':'goods';
	
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

function editBtnClick(){
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
	}
	editChangeInit();
}

function editCompelated(){
	var shoppingItems = $('.goule-shopping-item').each(function(){
		var obj = $(this),
			tag = obj.attr('data-tag'),
			newCount = obj.find('.goodsNum').html();
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
	 	template = `<div class="goule-address-item" data-tag = "${id}">
				<div class="goule-address-item-text">
					
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
				count:obj.goodsInfo.count,
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


$(function(){
	pageInit();
})

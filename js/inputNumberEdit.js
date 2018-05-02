/*
 **
 
 数字输入框控制代码
 
  
 **
*/

function decrease(){
	var valueContainer = $(this).siblings('.goodsNum'),
		value = Number(valueContainer.html());
	if(value>1){
		valueContainer.html(value-1);
	}
}

function increase(){
	var valueContainer = $(this).siblings('.goodsNum');
	valueContainer.html(Number(valueContainer.html())+1);
	
}

function operationInit(){
	$('.goule-shopping-item-num-editor').on('touchend',function(e){
		e.stopPropagation();
	})
	$('.decrease').on('touchend',decrease);
	$('.increase').on('touchend',increase);
}

$(function(){
	operationInit()
})

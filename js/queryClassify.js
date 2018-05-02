function pageInit(){
	
	//初始化方法
	bindClassifyClick();
}

function bindClassifyClick(){
	$('.goule-classify').on('tap',changeSelected)
}

function changeSelected(e){
	var target = $(e.target),
		loadPage;
	
	if(target[0].tagName === "P"){
		target = target.parent();
	}
	if(target.attr('class') !== 'goule-classify'){
		loadPage = target.attr('data-tag');
		target.siblings().removeClass('goule-classify-active');
		target.addClass('goule-classify-active');
		$('.goule-classify-container').map(function(){
			if($(this).attr("data-tag") == loadPage){
				$(this).siblings('.goule-classify-container').hide();
				$(this).show();
				
			}
		})
	}
}

$(function(){
	pageInit();
})

var load = (function(){
	var loadDiv = $('.goule-loading'),
		markDiv = $('.Mark-white');
	
	function showLoad(){
		loadDiv.show();
		markDiv.show();
	}
	
	function hideLoad(){
		loadDiv.hide();
		markDiv.hide();
	}
	
	return {
		show:showLoad,
		hide:hideLoad
	}
	
})();

var hint = (function(){
	var hintDiv = $('.goule-hint'),
		markDiv = $('.Mark');
	
	$('#hint-sure').on('tap',hideHint);
	
	function showHint(text){
		$('#hint-text').html(text);
		hintDiv.show();
		markDiv.show();
	}
	
	function hideHint(){
		hintDiv.hide();
		markDiv.hide();
	}
	
	return {
		show:showHint,
		hide:hideHint
	}
	
})();

function showComfirm(text,cancle,comfirm){
	$('#comfirm-text').html(text);
	$('#comfirm-cancle').on('touchend',cancleClick);
	$('#comfirm-sure').on('touchend',comfirmClick);
	$('.goule-comfirm').show();
	$('.Mark').show();
	
	function cancleClick(){
		hideComfirm();
		cancle();
	}
	function comfirmClick(){
		hideComfirm();
		comfirm();
	}
	function hideComfirm(){
		$('.goule-comfirm').hide();
		$('#comfirm-cancle').unbind();
		$('#comfirm-sure').unbind();
		$('.Mark').hide();
	}
	
}



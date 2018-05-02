function buyGoods(){
	window.location.href =  "orderPage.html";
}
$(function(){
	$('#full_feature').css({
		'height':screen.width+'px'
	});
	$('#full_feature').swipeslider({
	});
	$('#buy-now').on('tap',buyGoods);
})

/*
**
 
 主页面JS代码
 
  
 **
*/
function footerNav(){
	var URL = {
		page01:"index.html",
		page02:"queryClassify.html",
		page03:"shoppingCart.html",
		page04:"personPage.html"
	}
	
	$('.goule-footer-area').on('touchend',function(e){
		var target = e.target,
			index;
		if(target.nodeName == "I" || target.nodeName == "P"){
			target = target.parentElement;
		}
		index = $(target).attr('data-tag');
		window.location.href = URL["page"+index];
	});
}

$(function(){
	footerNav();
})

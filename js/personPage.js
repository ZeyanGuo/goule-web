function initPage(){
	var personData = JSON.parse(localStorage.getItem('User'));
	$('#person-name').html(personData.nickname);
	$('#person-img').attr('src',personData.avatar);
}

$(function(){
	initPage();
})

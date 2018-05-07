function QueryString(item){
	var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
	return svalue ? svalue[1] : svalue;
}

function attributeCount(obj) {
    var count = 0;
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
            count++;
        }
    }
    return count;
}
function num2tring($num) {
    if ($num >= 10000) {
        $num = Math.round($num / 10000 * 100) / 100 + '万';
    }else if($num >= 1000) {
        $num = Math.round($num / 1000 * 100) / 100 + '千';
    } else {
        $num = $num;
    }
    return $num;
}

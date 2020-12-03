// 获取URL上的参数
export const getUrlParam = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
};


// base64加密
export const encode64 = function(input) {
	var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
    + "wxyz0123456789+/" + "=";
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	do {
	    chr1 = input.charCodeAt(i++);
	    chr2 = input.charCodeAt(i++);
	    chr3 = input.charCodeAt(i++);
	    enc1 = chr1 >> 2;
	    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	    enc4 = chr3 & 63;
	    if (isNaN(chr2)) {
	      enc3 = enc4 = 64;
	    } else if (isNaN(chr3)) {
	      enc4 = 64;
	    }
	    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
	        + keyStr.charAt(enc3) + keyStr.charAt(enc4);
	    chr1 = chr2 = chr3 = "";
	    enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
};


// 获取滚动条宽度
export const getScrollbarWidth = function () {
  var odiv = document.createElement('div'),//创建一个div
      styles = {
        width: '100px',
        height: '100px',
        overflowY: 'scroll'//让他有滚动条
      }, i, scrollbarWidth;
  for (i in styles) odiv.style[i] = styles[i];
  document.body.appendChild(odiv);//把div添加到body中
  scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
  document.body.removeChild(odiv);//移除创建的div
  return scrollbarWidth;//返回滚动条宽度
}
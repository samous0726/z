/**
 * 工具集
 * @author toyflivver (Mr.Qu)
 * @QQ 2440659688
 */
 // time formatter
 function dateListFormat (timeParam){
    var timeNow = parseInt(new Date().getTime() / 1000);
    var publishTime;
    var d;
    var time;
    $.each(timeParam, function (i, n){
       publishTime = parseInt(new Date(n.create_user_time).getTime() / 1000);
       d = timeNow - publishTime;
       d_days = parseInt(d / (60 * 60 * 24));
       d_hours = parseInt(d / (60 * 60));
       d_minutes = parseInt(d / 60);
       if(d_days>0 && d_days<30){
         time = d_days + "天前";
       }else if(d_hours<=24 && d_hours > 0){
         time = d_hours + "小时前";
       }else if(d_minutes < 60 && d_minutes>0){
         time = d_minutes + "分钟前";
       }
       n.create_user_time = time;
    });
 }

 function dateFormat(timeParam){
		var timeNow = parseInt(new Date().getTime() / 1000);
		var publishTime;
		var d;
		var time;
		publishTime = parseInt(new Date(timeParam.create_user_time).getTime() / 1000);
		d = timeNow - publishTime;
		d_days = parseInt(d / (60 * 60 * 24));
		d_hours = parseInt(d / (60 * 60));
		d_minutes = parseInt(d / 60);
		if(d_days>0 && d_days<30){
			time = d_days + "天前";
		}else if(d_hours<=24 && d_hours > 0){
			time = d_hours + "小时前";
		}else if(d_minutes < 60 && d_minutes>0){
			time = d_minutes + "分钟前";
		}
		timeParam.create_user_time = time;

 }

function initPageBar(page_bar_id,_data){
	var $pageBtnTep = $('<button class="btn btn-link btn-xs"  data-page=""></button>');
	var $pageBar = $(page_bar_id);
	var $prePage = $pageBtnTep.clone();
	var $nextPage = $pageBtnTep.clone();
	var curPage = _data.data.pageNumber;
	var barStart = curPage-2;
	var barStop = curPage+2;

	$prePage.html("< 上一页").attr("data-page",curPage-1);
	$nextPage.html("下一页 >").attr("data-page",curPage+1);
	if(_data.data.totalPage == 0){
		$prePage.attr("disabled",true);
		$nextPage.attr("disabled",true);
		$pageBar.append($prePage);
		$pageBar.append($nextPage);
	}else{
		if(_data.data.firstPage){
			$prePage.attr("disabled",true);
		}
		if(_data.data.lastPage){
			$nextPage.attr("disabled",true);
		}
		$pageBar.append($prePage);

		if(barStart>1){
			var $firstBtn = $pageBtnTep.clone()
				.html("1..")
				.attr("data-page",1);
			$pageBar.append($firstBtn);
		}

		for(var i=barStart; i<=barStop; i++){
			if(i>0 && i<=_data.data.totalPage){
				var $pageBtn = $pageBtnTep.clone();
				$pageBtn.html(i).attr("data-page",i);
				if(i==curPage){
					$pageBtn.addClass("active").addClass("btn-default");
				}
				$pageBar.append($pageBtn);
			}
		}

		if(barStop<_data.data.totalPage){
			var $firstBtn = $pageBtnTep.clone()
				.html(".."+_data.data.totalPage)
				.attr("data-page",_data.data.totalPage);
			$pageBar.append($firstBtn);
		}

		$pageBar.append($nextPage);
	}
}

function initPageBarNew(page_bar_id, currentPage, totalPage, barSize){
	var $pageBtnTep = $('<button class="btn btn-link btn-xs"  data-page=""></button>');
	var $pageBar = $(page_bar_id);
	var $prePage = $pageBtnTep.clone();
	var $nextPage = $pageBtnTep.clone();
	currentPage = Number(currentPage);
	totalPage = Number(totalPage);
	barSize = Number(barSize);
	var barStart = currentPage-barSize;
	var barStop = currentPage+barSize;

	$prePage.html("< 上一页").attr("data-page",currentPage-1);
	$nextPage.html("下一页 >").attr("data-page",currentPage+1);
	if(currentPage == 1 || currentPage == "1"){
		$prePage.attr("disabled",true);
	}
	if(currentPage == totalPage){
		$nextPage.attr("disabled",true);
	}
	$pageBar.append($prePage);

	if(barStart>1){
		var $firstBtn = $pageBtnTep.clone()
			.html("1..")
			.attr("data-page",1);
		$pageBar.append($firstBtn);
	}

	for(var i=barStart; i<=barStop; i++){
		if(i>0 && i<=totalPage){
			var $pageBtn = $pageBtnTep.clone();
			$pageBtn.html(i).attr("data-page",i);
			if(i==currentPage){
				$pageBtn.addClass("active").addClass("btn-default");
			}
			$pageBar.append($pageBtn);
		}
	}

	if(barStop<totalPage){
		var $firstBtn = $pageBtnTep.clone()
			.html(".."+totalPage)
			.attr("data-page", totalPage);
		$pageBar.append($firstBtn);
	}

	$pageBar.append($nextPage);

}

function initSelectAll(tableId, onSomeChecked,onCancelCheck, onAllChecked, onNoOneChecked){

	var $table = $(tableId);
	$table.find(".select-index").show();
	$table.find(".select-all").show();
	$table.find(".select-box").hide();
	bindOnHover();

	$(tableId).find(".select-all").click(function(){
		var $selectOnes = $table.find(".select-box");
		if($(this).is(":checked")){
			$selectOnes.prop("checked", true);
			cleanHoverAndShowCheckBox();
			if(onAllChecked){
				onAllChecked();
			}
		}else{
			$selectOnes.prop("checked", false);
			cleanHoverAndShowIndex();
			bindOnHover();
			if(onNoOneChecked){
				onNoOneChecked();
			}
		}
	});

	$table.find(".select-box").click(function(){
		if($(this).is(":checked")){
			cleanHoverAndShowCheckBox();
			if(onSomeChecked){
				onSomeChecked($(this));
			}
			if(allChecked()){
				$(tableId).find(".select-all").prop("checked",true);
				if(onAllChecked){
					onAllChecked();
				}
			}

		}else{
			$(tableId).find(".select-all").prop("checked",false);
			if(onCancelCheck){
				onCancelCheck($(this));
			}
			if(!havaChecked()){
				cleanHoverAndShowIndex();
				bindOnHover();
				if(onNoOneChecked){
					onNoOneChecked();
				}
			}
		}
	});

	function havaChecked(){
		var $checked = $table.find(".select-box:checked");
		return $checked.length > 0;
	}

	function allChecked(){
		var $checkedCheckbox = $table.find(".select-box:checked");
		var $allCheckbox = $table.find(".select-box");
		return $checkedCheckbox.length == $allCheckbox.length;
	}

	function bindOnHover(){
		$table.find("tr").each(function(){
			if($(this).find("td:first").find("input").attr("value")==""){
				return;
			}
			$(this).find("td:first").hover(function(){
				$(this).find(".select-box").show();
				$(this).find(".select-index").hide();
			});
			$(this).find("td:first").mouseleave(function(){
				$(this).find(".select-box").hide();
				$(this).find(".select-index").show();
			});
		});
	}

	function cleanHoverAndShowCheckBox(){
		$table.find("tr").each(function(){
			$(this).find("td:first").unbind("hover");
			$(this).find("td:first").unbind("mouseleave");

		});
		$table.find(".select-box").show();
		$table.find(".select-index").hide();
	}

	function cleanHoverAndShowIndex(){
		$table.find("tr").each(function(){
			$(this).find("td:first").unbind("hover");
			$(this).find("td:first").unbind("mouseleave");
		});
		$table.find(".select-box").hide();
		$table.find(".select-index").show();
	}
}

function cacelSelectAll(tableId){
	var $table = $(tableId);
	$table.find(".select-box").hide();
	$table.find(".select-all").hide();
	$table.find(".select-index").show();

	$table.find(".select-box").prop("checked", false);

	$(tableId).find(".select-all").unbind("click");

	$table.find(".select-box").unbind("click");

	$table.find("tr").each(function(){
		$(this).find("td:first").unbind();
		$(this).find("td:first").unbind();
	});
}

/**
 * 为String类型的对象增加replaceAll方法
 */
String.prototype.replaceAll = function(s1,s2){
//	return this.replace(new RegExp(s1,"gm"),s2);
	var finish = false;
	var resultStr = this.replace(s1,s2);
	while(!finish){
		if(resultStr.indexOf(s1) > 0){
			resultStr = resultStr.replace(s1 , s2);
		}else{
			finish = true;
		}
	}
	return resultStr;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}


var JSONTool= new Object();
/**
 * 将一般JS对象转化成JSON对象。
 */
JSONTool.toJSON = function(data){
	return JSON.stringify(data);
}
/**
 * 将JSON解析一般JS对象。
 */
JSONTool.fromJSON = function(jsonData){
	return JSON.parse(jsonData);
}

var StringTool = new Object();
StringTool.isNull = function(str){
	var result = null;
	if(str == undefined || str == null){
		result = true;
	}else{
		result = false;
	}
	return result;
}

StringTool.isEmpty = function(str){
	var result = null;
	if(str == undefined || str == null || str == ""){
		result = true;
	}else{
		result = false;
	}
	return result;
}

$.scrollto = function(position, time){
	$('html, body').animate({
		scrollTop: $(position).offset().top
	}, time);
}


var Checkor = new Object();

Checkor.number = "number";

Checkor.require = function(str ){
	if(StringTool.isEmpty(str)){
		return false;
	}else{
		return true;
	}
}


Checkor.isEmpty = function(str){
	if(StringTool.isEmpty(str)){
		return true;
	}else{
		return false;
	}
}

Checkor.isNumber = function(str){
	var num = Number(str);
	if(num == NaN){
		return false;
	}else{
		return true;
	}
}

Checkor.notNumber = function(str){
	var num = Number(str);
	if(num == NaN){
		return true;
	}else{
		return false;
	}
}

Checkor.isEmail = function(str){
	var regExp = new RegExp("^[0-9A-Za-z]@[0-9A-Za-z].com$");
	return regExp.test(str);
}
//判断是否是家庭电话
Checkor.isHomePhone=function(str){
  var checkPhone = /^0\d{2,3}-?\d{7,8}$/;
  return checkPhone.test(str);
}
//判断是否是邮编
Checkor.isPostCode=function(str){
  var checkPostCode= /^[1-9][0-9]{5}$/
  return checkPostCode.test(str)
}

Checkor.isEmail = function(str){
	return !Checkor.isEmail(str);
}


/**
 * 如果str是手机号码格式则返回true
 * 手机是：12位号码，座机是：（4位区号和一个"-"，可选）8位号码
 */
Checkor.isPhone = function(str){
	var regExp = new RegExp("^([0-9]{12}|[0-9]{4}-[0-9]{8}|[0-9]{8})$");
	return regExp.test(str);
}

/**
 * 如果str不是手机号码格式则返回true
 */
Checkor.notPhone = function(str){
	return !Checkor.isPhone(str);
}


/**
 * 开始时间与结束时间判断
 * @param startTime 开始时间
 * @param endTime  结束时间
 * @returns {boolean} startTime 早于 endTime 返回 true,否则返回false
 */
Checkor.isStartTimeEarlier = function(startTime, endTime){
	var start=new Date(startTime.replace("-", "/").replace("-", "/"));
	var end=new Date(endTime.replace("-", "/").replace("-", "/"));
	console.log(start.getTime());
	console.log(end.getTime());
	if( start.getTime() < end.getTime() ){
		return true;
	}else{
		return false;
	}
}

/**
 * 开始时间与结束时间判断
 * @param startTime 开始时间
 * @param endTime  结束时间
 * @returns {boolean} startTime 晚于 endTime 返回 false,否则返回 true
 */
Checkor.notStartTimeEarlier = function(startTime, endTime){
	return !Checkor.isStartTimeEarlier(startTime, endTime);
}

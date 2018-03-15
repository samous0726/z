/**
 *
 * < version 1.1.26 >
 *
 * Copyright© Zhang zheng
 *
 * Composed by Zhang zheng ( Samous Zhang )
 *
 * Date: 2017/12/06
 *
 * version update rules: update the big version every year but also update the little version in one year
 *
 */
( function (win, $) {

    "use strict";

    if (typeof $ !== 'function')
        throw new Error( 'jQuery is not found, Z.js need jQuery!' );

    // this is a inner object for creating the library and mounting functions
    var _Z =  {};

    // TEEval template engine
    _Z. TEEval = function (tpl, data) {
        tpl = tpl.replace(/^\s+|\s+$/gm, '').replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/(&lt;)/g, '<').replace(/(&amp;)/g, '&').replace(/(&gt;)/g, '>');
        var t, fn = '(function(){ var $reg = RegExp(/null|undefined/i);var T = \'\'',
            tpls = tpl.split('<nb>');
        for ( t in tpls ) {
            var p = tpls[t].split('</nb>');
            if (t !== '0') {
                fn += '=' === p[0].charAt(0)
                    ? '+($reg.test(typeof(' + p[0].substr(1) + ')) ? \'\' : ' + p[0].substr(1) + ')'
                    : ';' + p[0] + 'T=T';
            }
            fn += '+\'' + p[ p.length - 1 ] + '\'';
        }
        fn += ';return T; })(); ';
        fn += '\n //@ sourceURL=TEEval.js';
        return data ? eval(fn) : fn;
    };

    _Z. renderFile = function ( file, data, container ) {
        var path = '/' + file + '.html',
            content = window['cache_'+file];
        var render = function ( f, d, c, h ) {
            c ? c.after( _Z.TEEval( h, d ) ) : $('#' + f).html( _Z.TEEval( h, d ) );
        };
        if ( content ) {
            render( file, data, container, content );
            return;
        }
        $.ajax({
            url : path,
            type : 'GET',
            dataType : 'text',
            async: false,
            success : function ( html ) {
                render( file, data, container, html );
                window['cache_'+file] = html;
            }
        });
    };

    _Z. EventControl = {
        // forbidden button continuous clicks in 2s
        btnDisabled: function (btn) {
            btn.prop( 'disabled', true );
            setTimeout(function(){
                btn.prop( 'disabled', false );
            }, 2000);
        },

        prevent2sByAddClass: function (btn) {
            if ( btn.length === 0 ) return;
            btn.addClass( 'disabled' );
            setTimeout(function(){
                btn.removeClass( 'disabled' );
            }, 2000);
        },

        getValidCode: function () {
            var monitor = function($getCode) {
                var LocalDelay = getLocalDelay();
                if(LocalDelay.time != null){
                    var timeLine = parseInt((new Date().getTime() - LocalDelay.time) / 1000);
                    if (timeLine < LocalDelay.delay) {
                        var _delay = LocalDelay.delay - timeLine;
                        $getCode.text(_delay + "s后再获取");
                        $getCode.addClass('disabled');
                        var timer = setInterval(function() {
                            if (_delay > 1) {
                                _delay--;
                                $getCode.text(_delay+"s后再获取");
                                setLocalDelay(_delay);
                            } else {
                                clearInterval(timer);
                                $getCode.text("获取验证码");
                                $getCode.removeClass('disabled');
                            }
                        }, 1000);
                    }
                }
            };

            var countDown = function ($getCode) {
                if ($getCode.text() == "获取验证码") {
                    var _delay = 60;
                    var delay = _delay;
                    $getCode.text(_delay+"s后再获取");
                    $getCode.addClass('disabled');
                    var timer = setInterval(function() {
                        if (delay > 1) {
                            delay--;
                            $getCode.html(delay+"s后再获取");
                            setLocalDelay(delay);
                        } else {
                            clearInterval(timer);
                            $getCode.text("获取验证码");
                            $getCode.removeClass('disabled');
                        }
                    }, 1000);

                } else {
                    return false;
                }
            };

            //set local delay
            function setLocalDelay (delay) {
                sessionStorage.setItem("delay_", delay);
                sessionStorage.setItem("time_", new Date().getTime());
            }

            //get local delay()
            function getLocalDelay() {
                var LocalDelay = {};
                LocalDelay.delay = sessionStorage.getItem("delay_");
                LocalDelay.time = sessionStorage.getItem("time_");
                return LocalDelay;
            }

            $.fn.extend({
                startGetCode: function(){
                    return this.each(function(){
                        countDown( $(this) );
                    });
                }
            });

            $.fn.extend({
                startMonitor: function(){
                    return this.each(function(){
                        monitor( $(this) );
                    });
                }
            });

            // param = { 获取按钮， 手机号输入框， url, request }
            return function ( param ) {
                if( !param ) return;
                var button = param.button,
                    input = param.input,
                    req = param.request;

                input.focus(function () {
                    input.css('border', "0");
                });
                button.startMonitor();
                input.on('input', function () {
                    if ( _Z.Checker.isMobile_17(this.value) ) {
                        button.text().indexOf('s后再获取') === -1 ? button.removeClass('disabled') : '';
                        return;
                    }
                    button.addClass('disabled');
                });
                // 获取验证码
                button.off().click(function () {
                    button.startGetCode();
                    req.mobile = input.val();
                    _Z.post( param.url, req, function () {} );
                });

            }

        },

    };

    /**
     *  ajax
     */
    _Z. post = function(url, data, suFn){
        if( _Z.StringTool.isStringEmpty(url) ) {
            console.log('post -> url is null');
            return;
        }
        if(suFn){
            $.ajax({
                url : url,
                data : data,
                type : 'POST',
                dataType : 'json',
                success : suFn,
            });
        } else {
            $.ajax({
                url : url,
                data : null,
                type : 'POST',
                dataType : 'json',
                success : data,
            });
        }
    };

    _Z. get = function(url, data, suFn){
        if( _Z.StringTool.isStringEmpty(url) ) {
            console.log('get -> url is null');
            return;
        }
        if(suFn){
            $.ajax({
                url : url,
                data : data,
                type : 'GET',
                dataType : 'json',
                success : suFn,
            });

        } else {
            $.ajax({
                url : url,
                data : null,
                type : 'GET',
                dataType : 'json',
                success : data,
            });
        }

    };

    /**
     * css动画库jquery插件
     */
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        }
    });


    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    win. Date. prototype. Format = function (fmt) { //author: meizz
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
        var k;
        for ( k in o )
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };



    _Z. JSONTool = {

        formGetData: function (form, param) {
           var request = {};
           if ( !form ) return request;

           var _input = form.find('input') || [],
               k, val, name, i = 0;
           for ( ; i < _input.length; i++ ) {
               name = _input[i].name;
               val = _input[i].value;
               if ( name && val ) {
                   request[ name ] = val;
               }
           }
           if( param && typeof param === 'object') {
               for ( k in param ) {
                   request[k] = param[k];
               }
           }
           if( param && $(param).length === 1 ) {
               var __form = $(param),
                   __input = __form.find('input') || [];

               var j = 0;
               for ( ; j < __input.length; j ++) {
                   request[__input[j].name] = __input[j].value;
               }
           }
           return request;
        },

        length: function ( obj ) {
            var k, count = 0, o = obj;
            if ( !o ) return count;


            if ( typeof o === 'object' ) {
                for ( k in o ) {
                    count++;
                }
                return count;
            }

            return o.length;

        }

    };

    _Z. Format = {

        cashFormat: function (cash) {
            return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        fromDateGenerator: function ( date, format ) {
            date = typeof date === 'string' ? date.trim() : '';
            if ( date.indexOf('20') !== 0 ) return [];
            var applyDate = new Date( date ),
                current = new Date(),
                arr = [];
            while ( applyDate < current ) {
                arr.push( applyDate.Format( format || 'yyyy-MM' ) );
                applyDate.setMonth( applyDate.getMonth() + 1 );
            }
            return arr.reverse();
        },

        validFormat: function (flag, input, btn) {
            if ( !flag ) {
                input.css('border', '1px solid #FF6A6A');
                btn.addClass('disabled');
            } else {
                input.css('border', 'none');
                btn.removeClass('disabled');
            }
        },

        dateFmt: function ( date, fmt ) {
            return new Date( date ).Format( fmt );
        },

        turnToHTML: function ( str ) {
          return str.replace(/\r\n|\n|\r/g, '<br>').replace(/\s/g, '&nbsp;');
        },

        deleteSpace: function ( str ) {
            return str.replace(/(^\s*)|(\s*$)|\s/g, "");
        }
    };

    _Z. StringTool = {

        isNull: function(str){
            var result = null;
            if(str === undefined || str === null){
                result = true;
            } else {
                result = false;
            }
            return result;
        },

        isStringEmpty: function(str){
            if(str === undefined || str === null || str === ""){
                return true;
            }
            return false;
        },

        replaceAll: function(s1,s2){
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
        },
    };

    $.scrollto = function( position, time ){
        $('html, body').animate({
            scrollTop: $(position).offset().top
        }, time);
    };

    /**
     * 校验器
     */
    _Z. Checker = {

        number: 'number',

        isContains: function( str, substr ){
            return str.indexOf(substr) >= 0;
        },

        require: function( str ) {
            if(_Z.StringTool.isStringEmpty(str))
                return false;
            return true;
        },

        isEmpty: function( obj ) {
            if( typeof obj === 'undefined' ){
                return true;
            }
            if( Array.isArray( obj ) ) {
                return obj.length === 0;
            }
            if ( typeof obj === "object" && !( Array.isArray( obj ) ) ){
                var prop, hasProp = false;
                for ( prop in obj ) {
                    hasProp = true;
                    break;
                }
                return !hasProp;
            }
            if ( typeof obj === 'string' ){
              return  _Z.StringTool.isStringEmpty( obj );
            }
        },

        isEmptyForm: function ( form, btn ){
            if ( !form || form.length !== 1 ) return null;

            var empty = false,
                $input = form.find(
                    'input[type=\'text\'], ' +
                    'input[type=\'hidden\'], ' +
                    'input[type=\'password\'], ' +
                    'input[type=\'number\'], textarea'
                ),
                $radio = form.find('input[type=\'radio\']'),
                $select = form.find('select'),
                $checkbox = form.find('input[type=\'checkbox\']');

            function splitInput ( $radio ) {
                var splitRadio = [];
                $radio.each(function () {
                    splitRadio.push(this.name);
                });
                $.unique(splitRadio);
                return splitRadio.length;
            }

            $input.each(function () {
                if ( _Z.StringTool.isStringEmpty(this.value) ) {
                    empty = true;
                    return false;
                }
            });

            if( empty ){
                return btn ? btn.addClass('disabled') : empty;
            }

            if ( $select.length !== 0 ) {
                if ( form.find('select option:selected').length < splitInput( $select ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }

            if ( $radio.length !== 0 ) {
                if ( form.find('input[type=\'radio\']:checked').length < splitInput( $radio ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }

            if ( $checkbox.length !== 0 ) {
                if ( form.find('input[type=\'checkbox\']:checked').length < splitInput( $checkbox ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }

            return btn ? btn.removeClass('disabled') : false;
        },

        isEmptyInputForm: function (form, btn){

            if ( !form ||form.length !== 1 ) return null;

            var empty = false;

            form.find('input').each(function () {
                if( !this.value ){
                    empty = true;
                    return false;
                }
            });

            if ( empty ) {
                return btn ? btn.addClass('disabled') : true;
            }
            return btn ? btn.removeClass('disabled') : false;
        },

        hasProperty: function(obj, prop){
            if( typeof (obj) !== 'object' )
                return false;
            return obj.hasOwnProperty(prop);
        },

        isNumber: function(str){
            var num = Number(str);
            if(num === NaN){
                return false;
            } else {
                return true;
            }
        },

        notNumber: function(str){
            var num = Number(str);
            if(num === NaN){
                return true;
            } else {
                return false;
            }
        },

        isEmail: function(str){
            var regExp = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
            return regExp.test(str);
        },

        isHomePhone: function(str){
            var checkPhone = /^0\d{2,3}-?\d{7,8}$/;
            return checkPhone.test(str);
        },

        isPostCode: function(str){
            var checkPostCode= /^[1-9][0-9]{5}$/;
            return checkPostCode.test(str)
        },

        isPlateNo: function(str, input, btn) {
            var reg5 = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
            var reg6 = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{6}$/;
            if ( !input ) {
                return reg5.test(str) || reg6.test(str)
            }

            _Z.Format.validFormat( ( reg5.test(str) || reg6.test(str) ), input, btn );
        },

        isCertNum: function(str) {
            var reg = new RegExp(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
            return reg.test(str);
        },

        isNotCertNum: function(str) {
            return !_Z.Checker.isCertNum(str);
        },

        isMobile_17: function (str, input, btn) {
            if ( !str ) return false;
            var regExp = new RegExp(/^(((13[0-9]{1})|(15[0-35-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
            var test = regExp.test(str);
            if ( !input ){
                return test;
            }
            _Z.Format.validFormat(test, input, btn);
        },

        /**
         * 开始时间与结束时间判断
         * @param startTime 开始时间
         * @param endTime  结束时间
         * @returns {boolean} startTime 早于 endTime 返回 true,否则返回false
         */
        isStartTimeEarlier: function(startTime, endTime){
            var start=new Date(startTime.replace("-", "/").replace("-", "/"));
            var end=new Date(endTime.replace("-", "/").replace("-", "/"));
            if( start.getTime() < end.getTime() ){
                return true;
            }else{
                return false;
            }
        },

    };

    _Z. Storage = {
        clearInputStorage: function ($input) {
            $input.each(function () {
                var name = this.name;
                localStorage.removeItem(name);
            });
        },

    };

    /**
     * Package framework7
     *
     * picker 省市区组件
     */
    _Z. F7InitPicker = function (selector, pca){
        var _selector = selector || '',
            pcaArr = [];

        if(pca){
            pcaArr = pca.split(" ");
        }
        var p, pro = [],
            city = [],
            area = [];

        // 省分数组
        for ( p in Z.static.province_city_area ) {
            pro.push(p);
        }
        city = getCitys(pcaArr[0]);
        area = getAreas(pcaArr[0], pcaArr[1]);

        if($.inArray(pcaArr[0], pro) == -1){
            pcaArr[0] = pro[0];
        }
        if($.inArray(pcaArr[1], city) == -1){
            pcaArr[1] = city[0];
        }
        if($.inArray(pcaArr[2], area) == -1){
            pcaArr[2] = area[0];
        }

        myApp.picker({
            input: _selector,
            onlyOnPopover: true,
            scrollToInput: false,
            rotateEffect: true,
            value: pcaArr,
            toolbarCloseText: '完成',
            closeByOutsideClick: true,
            formatValue: function (picker, values) {
                return values.join(' ');
            },
            cols: [
                {
                    width: '25%',
                    textAlign: 'center',
                    values: pro,
                    onChange: function (picker, province) {
                        //每次选城市的时候先清掉之前选的省份
                        city.length = 0;
                        city = getCitys(province);
                        // 选完省份联动城市赋值
                        if (picker.cols[1].replaceValues) {
                            picker.cols[1].replaceValues(city);
                        }

                        // 同时给地区赋值
                        area.length = 0;
                        area = getAreas(province, city[0]);
                        if (picker.cols[2].replaceValues) {
                            picker.cols[2].replaceValues(area);
                        }
                    }
                },
                {
                    textAlign: 'center',
                    width: '30%',
                    values: city,
                    onChange: function (picker, c) {
                        var province = picker.cols[0].value;

                        area.length = 0;
                        area = getAreas(province, c);
                        if (picker.cols[2].replaceValues) {
                            picker.cols[2].replaceValues(area);
                        }
                    }
                },
                {
                    width: '44%',
                    textAlign: 'center',
                    values: area
                }
            ]
        });

        function getCitys(province){
            var _province = province || "北京市";
            var c, citys = [];
            if( !Z.static.province_city_area[_province] ){
                _province = "北京市";
            }
            for ( c in Z.static.province_city_area[_province] ){
                citys.push(c);
            }
            return citys;
        }

        function getAreas(province, city){

            var _province = province || "北京市",

                _city = city || "市辖区";

            if( !Z.static.province_city_area[_province] ){
                _province = "北京市";
            }

            if( !Z.static.province_city_area[_province][_city] ){
                _city = "市辖区";
            }

            var a, area,
                areas = [];

            for ( a in Z.static.province_city_area[_province][_city] ){

                area = Z.static.province_city_area[_province][_city][a];

                areas.push( area );

            }

            return areas;

        }

    };



    /**
     * static data post here
     *
     *
     */
    _Z. static = {


    };

    var Z = {};

    // conform all the child nodes of child nodes to child nodes;
    _Z. extend = function () {
        var s, sType;

        for ( s in this ) {

            if ( _Z .Checker .hasProperty( Z, s ) ) {
                throw 'The key name \' ' + s + ' \' has been occupied!';
            }

            // load the static data
            if ( s === 'static' && _Z.length) {
                Z[ s ] = this[ s ];
                continue;
            }

            sType = typeof this[ s ];

            switch ( sType ) {

                case 'function':
                    Z[ s ] = this[ s ];
                    break;

                case 'object':
                    _Z.extend.call( this[ s ] );
                    break;

                default:

            }

        }

    };

    _Z.extend.call( _Z );



    win .JSB =

        win .Z  =  Z;


})(window, typeof jQuery !== 'undefined' ? jQuery : undefined);

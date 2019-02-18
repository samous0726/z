/**
 *
 * < version 2.6.30 >
 *
 * Copyright© Samous Chang
 *
 * Composed by Samous Chang
 *
 * create date: 2017/12/06
 *
 * version update rules: update the big version every year but also update the little version in one year
 *
 */
(function (global, $, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global, $)
        : typeof define === 'function' && define.amd
            ? define(factory.bind(null, global, $))
            : factory(global, $)
})(
typeof window !== "undefined" ? window : this,
typeof jQuery !== 'undefined' ? jQuery : undefined,
function (win, $, undef) {

    "use strict";

    if (typeof $ !== 'function' && !$.jquery)
        throw new Error( 'jQuery is not found, Z.js need jQuery!' );

    // this is a inner object for creating the library and mounting functions
    var _Z =  {};

    // all the functions in this object are only support for Z.js itself to invoke, not support for its' users
    _Z. inner = {

        // this is a simple implementation of a designated curring variadic function
        // 这是一个指定可变参柯理化函数的简单实现
        // it has several functions :
        // 1. specify execution context to the object which first call the curring
        // 指定初次调用该函数时的对象做为执行上下文
        // 2. Specify when the original function is executed by specifying the number of variadic args
        // 通过指定可变参数量来明确何时执行原始函数
        currying: function (fn, n) {
            var arity = n || fn.length;
            return function curried() {
                var args = _Z.inner.argsToArray(arguments),
                    context = this;

                return args.length >= arity ?
                    fn.apply(context, args) :
                    function () {
                        var rest = _Z.inner.argsToArray(arguments);
                        return curried.apply(context, args.concat(rest));
                    };
            };
        },

        argsToArray: function ( args ) {
            return [].slice.call( args );
        },


    };

    _Z. fn = {

        TEFinal: function(tpl, data){
            var fn =  function(d) {
                return ( new Function('data', fn.$) ).call(d, d);
            };
            tpl = tpl.replace(/^\s+|\s+$/gm, '').replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/(&lt;)/g, '<').replace(/(&amp;)/g, '&').replace(/(&gt;)/g, '>');
            if( !fn.$ ) {
                var t, tpls = tpl.split('<nb>');
                fn.$ = "var $reg = RegExp(/null|undefined/i); var T=''";
                for( t in tpls ) {
                    var p = tpls[t].split('</nb>');
                    if ( t !== '0' ) {
                        fn.$ += '=' === p[0].charAt(0)
                            ? '+($reg.test(typeof(' + p[0].substr(1) + ')) ? \'\' : ' + p[0].substr(1) + ')'
                            : ';' + p[0] + 'T=T';
                    }
                    fn.$ += "+'" + p[ p.length - 1 ] + "'";
                }
                fn.$ += ";return T;";
                fn.$ += '\n //@ sourceURL=TEFinal.js';
            }
            return data ? fn(data) : fn;
        },

        xorDecode: function (str, key) {
            str = decodeURIComponent(str);
            var i = 0, l = str.length, result = '';
            for ( ; i < l; i++ ) {
                result += String.fromCharCode( str.charCodeAt(i) ^ key.charCodeAt( i % key.length ) );
            }
            return result;
        }

    };

    _Z. ajax = {
        post: function(url, data, suFn){
            if( !url ) {
                console.warn('get -> url is null');
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
        },

        get: function(url, data, suFn){
            if( !url ) {
                console.warn('get -> url is null');
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
        },

        readFile: function ( path, fn ) {
            $.ajax({
                url : path,
                type : 'GET',
                dataType : 'text',
                async: false,
                success : fn
            });
        },

        renderFile: function ( file, data, container ) {
            var path = '/' + file + '.html',
                content = window['cache_file_'+file];
            if ( content ) {
                render( file, data, container, content );
                return;
            }
            this. readFile(path, function ( html ) {
                render( file, data, container, html );
                window['cache_file_'+file] = html;
            });
            function render( f, d, c, h ) {
                c ? c.after( _Z. fn. TEEval( h, d ) ) : $('#' + f).html( _Z. fn. TEEval( h, d ) );
            }
        }

    };

    _Z. event = {
        // scroll to the element position
        scrollTo: function ( el, area, speed ) {
            area.animate({scrollTop: el.offset().top - area.offset().top}, speed);
        },

        // forbidden button continuous clicks in 2s
        preventClickIn2s: function ( $btn ) {
            if ( !$btn || $btn.length === 0 ) return null;
            if ( $btn[0].Name === 'BUTTON' ) {
                $btn.prop( 'disabled', true );
                setTimeout(function(){
                    $btn.prop( 'disabled', false );
                }, 2000);
                return $btn;
            }
            $btn.addClass( 'disabled' );
            setTimeout(function(){
                $btn.removeClass( 'disabled' );
            }, 2000);
            return $btn;
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

    _Z. dataTool = {
        length: function ( obj ) {
            var k, count = 0, o = obj;
            if ( !o || o === {} ) return count;

            if ( _Z.Checker.getType(o) === 'object' ) {
                for ( k in o ) {
                    count++;
                }
                return count;
            }
            return o.length;
        },

        getMostElementInArray: function (arr) {
            if ( !arr.length ) return;
            var res = {};

            var i = 0,
                len = arr.length;

            // 遍历数组
            for ( ; i < len; i++ ) {
                if ( !res[ arr[i] ] ) {
                    res[ arr[i] ] = 1
                } else {
                    res[ arr[i] ]++
                }
            }
            // 遍历 res
            var keys = Object.keys(res),
                maxNum = 0,
                maxEle,
                len = keys.length;

            i = 0;

            for ( ; i < len; i++ ) {
                if ( res[keys[i]] > maxNum ) {
                    maxNum = res[keys[i]]
                    maxEle = keys[i]
                }
            }
            return {
                name: maxEle,
                num: maxNum
            }
        },

        getDiffElementsFromOneToAnotherArray: function (target, from) {
            var i = 0, j = 0,
                fl = from.length,
                tl = target.length,
                tempArray1 = [],
                result = [];
            if ( _Z. Checker. isEmpty( from ) ) return target;
            for ( ; i < fl; i++ ) {
                tempArray1[ from[i] ] = true;
            }
            for ( ; j < tl; j++ ) {
                if( !tempArray1[ target[j] ] ) {
                    result.push( target[j] );
                }
            }
            return result;
        },

        regroupArrayByKey: function ( data ) {
            var outer = {};

            // init every key name to be an array
            $.each(data[0], function (k) {
                outer[k] = []
            });
            // push the value into the corresponding key-array just initialized
            $.each(data, function () {
                $.each(this, function (k, v) {
                    outer[k].push( v );
                });
            });

            return outer;
        },

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

    };

    _Z. Format = {
        cashFormat: function (cash) {
            return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        getDateFromNow: function(d, f) {
            var type = d.charAt(0).toLowerCase(),
                format = f || 'yyyy-MM-dd',
                range = d.substr(1),
                current= new Date();
            switch ( type ) {
                case 'd':
                    return _Z. Format. dateFormat( current.setDate( current.getDate() - range ), format );
                case 'm':
                    return _Z. Format. dateFormat( current.setMonth( current.getMonth() - range ), format );
                case 'y':
                    return _Z. Format. dateFormat( current.setFullYear( current.getFullYear() - range ), format );
                default:
                    return null;
            }
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

        timer: function ( time, $show ){
            var timer = null, t = time, m=0, s=0;
            m = Math.floor( t / 60 % 60 );
            m < 10 && ( m = '0' + m );
            s = Math.floor( t % 60 );

            function countDown(){
                s--;
                s < 10 && ( s = '0' + s);
                if( s. length >= 3 ){
                    s = 59;
                    m = "0" + ( Number(m) - 1 );
                }
                if( m. length >= 3 ){
                    m = '00';
                    s = '00';
                    clearInterval(timer);
                }
                $show.text( m + ':' + s );
            }
            timer = setInterval(countDown,1000);
        },

        loopTimer: function (min) {
            var minute = min,
                second = 59,
                $min = $("#minute"),
                $snd = $("#second");

            setInterval(function() {
                if(second == '-1' && minute == '00') {
                    minute = min;
                    second = 59;
                }
                if(second == '-1' &&  minute != '00') {
                    second = 59;
                    minute--;
                    if(minute < 10) minute = "0" + minute;
                }
                if(second < 10) second = "0" + second;
                $min.text(minute);
                $snd.text(second);
                second--;
            }, 1000);
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

        getNow: function (fmt) {
            return new Date().Format( fmt || 'yyyy-MM-dd' )
        },

        dateFmt: function ( date, fmt ) {
            return new Date( date ).Format( fmt );
        },

        turnToHTML: function ( str ) {
            return str.replace(/\r\n|\n|\r/g, '<br>').replace(/\s/g, '&nbsp;');
        },

        cleanSpace: function ( str ) {
            return str.replace(/(^\s*)|(\s*$)|\s/g, "");
        },

        cleanReturn: function ( str ) {
            return str.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '')
        }
    };

    _Z. StringTool = {
        isNull: function(str){
            var result = null;
            if(str === undef || str === null){
                result = true;
            } else {
                result = false;
            }
            return result;
        },

        isStringEmpty: function(str){
            if(str === undef || str === null || str === ""){
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
        getType: function () {
            return Object.prototype.toString.call(arguments[0]).slice(8, -1).toLowerCase();
        },

        isPlainObject: function ( obj ) {
            return _Z.Checker.getType( obj ) === 'object';
        },

        isContains: function( str, substr ){
            return str.indexOf(substr) >= 0;
        },

        isEmpty: function( obj ) {
            var type = _Z.Checker.getType( obj );
            switch ( type ) {
                case 'null':
                    return null;
                case 'undefined':
                    return undef;
                case 'object':
                    var p, has = false;
                    for ( p in obj ) {
                        has = true;
                        break;
                    }
                    return !has;
                case 'array':
                    return obj.length === 0;
                case 'string':
                    return obj === '';
                default:
                    return false;
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

        isJSON: function (str) {
            if (typeof str !== 'string') return !1;
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && !this.isEmpty(obj)) {
                    return obj;
                } else {
                    return !1;
                }
            } catch (e) {
                return !1;
            }
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

        log: function (data) {
            console.log(data);
        }

    };

    _Z. Storage = {
        clearInputStorage: function ($input) {
            $input.each(function () {
                var name = this.name;
                localStorage.removeItem(name);
            });
        },

        bindWinVal: function ( k, v ) {
            if ( !v ) return win[ k ] ? win[ k ] : undef;
            if ( !win[ k ] )
                win[ k ] = v;
            return v;
        }

    };

    _Z. navigator = {
        getBrowser: function () {
            var nav = {},
                agent = navigator.userAgent.toLowerCase(),
                core = ['opera', 'firefox', 'chrome', 'safari', ['compatible', 'msie'], 'trident'];

            $.each(core, function () {
                var type = _Z.Checker.getType(this)
                if (type === 'string' && agent.indexOf(this) > -1) {
                    nav.name = this;
                    return false;
                } else if (
                    type === 'array'
                    && agent.indexOf(this[0]) > -1
                    && agent.indexOf(this[1]) > -1
                    && agent.indexOf('opera') < 0
                ) {
                    nav.name = 'ie';
                    return false;
                }
            });

            nav.version = (nav.name === 'ie')
                ? agent.match(/msie ([\d.]+)/)[1]
                : (nav.name == 'firefox')
                    ? agent.match(/firefox\/([\d.]+)/)[1]
                    : (nav.name == 'chrome')
                        ? agent.match(/chrome\/([\d.]+)/)[1]
                        : (nav.name == 'opera')
                            ? agent.match(/opera.([\d.]+)/)[1]
                            : (nav.name == 'safari')
                                ? agent.match(/version\/([\d.]+)/)[1]
                                : '0';

            nav.shell = (agent.indexOf('360ee') > -1)
                ? '360极速浏览器 360ee'
                : (agent.indexOf('360se') > -1)
                    ? '360安全浏览器 360se'
                    : (agent.indexOf('se') > -1)
                        ? '搜狗浏览器 se'
                        : (agent.indexOf('aoyou') > -1)
                            ? '遨游浏览器 aoyou'
                            : (agent.indexOf('theworld') > -1)
                                ? '世界之窗浏览器 theworld'
                                : (agent.indexOf('worldchrome') > -1)
                                    ? '世界之窗极速浏览器 worldchrome'
                                    : (agent.indexOf('greenbrowser') > -1)
                                        ? '绿色浏览器 greenbrowser'
                                        : (agent.indexOf('qqbrowser') > -1)
                                            ? 'QQ浏览器 qqbrowser'
                                            : (agent.indexOf('baidu') > -1)
                                                ? '百度浏览器 baidu'
                                                : nav.name;
            return nav;
        }
    };

    // this innerStatic data should be used only the library internally.
    // like any frame configs, initialized options inside the file.
    // it is strongly suggested not to put any given projects options data
    // in this object by changing the source code
    // you can mount any static data in this object in your project files instead of putting in here
    _Z. innerStatic = {};


    // conform all the child nodes of child nodes to child nodes;
    _Z. extend = function ( Z ) {
        var s, vType;

        for ( s in this ) {
            var value = this[ s ];
            if ( _Z .Checker .hasProperty( Z, s ) ) {
                throw 'The key name \' ' + s + ' \' has been occupied!';
            }

            // load the eChart functions go straight
            if ( s === 'eChart' && _Z.dataTool.length( value ) !== 0 ) {
                Z[ s ] = value;
                continue;
            }

            vType = typeof value;
            switch ( vType ) {
                case 'function':
                    Z[ s ] = value;
                    break;
                case 'object':
                    _Z.extend.call( value, Z );
                    break;
                default:
            }
        }
    };


    var Z = {
        static : {}
    };

    _Z.extend.call( _Z, Z );

    win .Z  =  Z;

    return Z;

})
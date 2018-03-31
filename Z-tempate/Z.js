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
( function (win, $, undef) {

    "use strict";

    if (typeof $ !== 'function')
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
                var args = _Z.argsToArray(arguments),
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
        // TEEval template engine
        TEEval: function (tpl, data) {
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
        }

    };

    _Z. ajax = {
        post: function(url, data, suFn){
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
        },

        get: function(url, data, suFn){
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
        },

        // TODO
        getPlugin: function (path) {
            $.ajax({
                url : path,
                type : 'GET',
                dataType : 'text',
                async: false,
                success : function () {

                }
            });
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
                content = window['cache_'+file];
            if ( content ) {
                render( file, data, container, content );
                return;
            }
            _Z.ajax.readFile(path, function ( html ) {
                render( file, data, container, html );
                window['cache_'+file] = html;
            });
            function render( f, d, c, h ) {
                c ? c.after( _Z.TEEval( h, d ) ) : $('#' + f).html( _Z.TEEval( h, d ) );
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
            if ( !$btn && $btn.length === 0 ) return null;
            if ( $btn.tagName === 'BUTTON' ) {
                $btn.prop( 'disabled', true );
                setTimeout(function(){
                    $btn.prop( 'disabled', false );
                }, 2500);
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


    // this static data should be used only the library internally.
    // like any frame configs, initialized options inside the file.
    // it is strongly suggested not to put any given projects options data
    // in this object by changing the source code
    // you can mount any static data in this object in your project files instead of putting in here
    _Z. static = { };

    var Z = {};

    // conform all the child nodes of child nodes to child nodes;
    _Z. extend = function () {
        var s, vType;

        for ( s in this ) {
            var value = this[ s ];
            if ( _Z .Checker .hasProperty( Z, s ) ) {
                throw 'The key name \' ' + s + ' \' has been occupied!';
            }

            // load the static data
            if ( s === 'static' && _Z.dataTool.length( value ) !== 0 ) {
                Z[ s ] = value;
                continue;
            }

            vType = typeof value;
            switch ( vType ) {
                case 'function':
                    Z[ s ] = value;
                    break;
                case 'object':
                    _Z.extend.call( value );
                    break;
                default:
            }
        }
    };

    _Z.extend.call( _Z );

    win .JSB =

        win .Z  =  Z;


})(window, typeof jQuery !== 'undefined' ? jQuery : undefined);

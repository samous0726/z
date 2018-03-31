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
    };

    _Z. event = {
        // forbidden button continuous clicks in 2.5s
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
        // scroll to the element position
        scrollTo: function ( el, area, time ) {
            area.animate({scrollTop: el.offset().top - area.offset().top + area.scrollTop()}, time);
        },

    };

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

        isCertNum: function(str) {
            var reg = new RegExp(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
            return reg.test(str);
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

    win .Ali =

        win .Z  =  Z;


})(window, typeof jQuery !== 'undefined' ? jQuery : undefined);

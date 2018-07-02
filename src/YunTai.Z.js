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
            if( !url ) {
                console.warn('post -> url is null');
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

        HSFPost: function ( method, data, fn ) {
            // 深复制data参数 否则会篡改数据源 违背函数式编程原则
            var d = {};
            if ( _Z.Checker.getType(data) === 'object' ) {
                if ( data ) {
                    d.paramData =  JSON.stringify( data );
                }
                d['userId'] = $('.empId').val();
                d['serviceName'] = 'AspHsfService';
                d['methodName'] = method;
            }
            $.ajax({
                url : '/expert/hsf',
                data : d,
                type : 'POST',
                dataType : 'json',
                success : fn,
                error: function (res) {
                    console.table(res)
                }
            });
        }
    };

    _Z. event = {
        // forbidden button continuous clicks in 2.5s
        preventClickIn2s: function ( $btn ) {
            if ( !$btn && $btn.length === 0 ) return null;
            if ( $btn[0].tagName === 'BUTTON' ) {
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

        // scroll to the element position
        scrollTo: function ( el, area, time ) {
            area.animate({scrollTop: el.offset().top - area.offset().top + area.scrollTop()}, time);
        },

    };

    _Z. style = {
        addInputWarn: function ( $input, remark ) {
            return  remark
                ? $input.addClass('caution-input').val('').attr('placeholder', remark)
                : $input.addClass('caution-input');
        },

        removeInputWarn: function ( $input ) {
            return $input.removeClass('caution-input');
        },

        addSelectWarn: function ( $sel ) {
            return  $sel.addClass('caution-input');
        },

        removeSelectWarn: function ( $sel ) {
            return $sel.removeClass('caution-input');
        },

        getHighlightColor: function ( num ) {
            var arr = ['#00FFFF','#FFFAF0','#FF34B3','#EEB422','#D1EEEE','#CAFF70',
                    '#98FB98','#8DEEEE','#76EEC6','#FFFF66','#FF3366','#FF33FF',
                    '#FF0033','#99FF66','#76EEC6','#66CCFF','#CCCCFF',
                ],
                length = arr.length;
            return num
                ? this.getMultipleColors( num, this.getHighlightColor )
                : arr[( Math.floor( Math.random() * length ))];
        },

        getRandomColor: function ( num ) {
            var i,arr = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'],
                clr = '#';
            for ( i = 0; i < 6; i++ ) {
                clr += arr[ Math.floor(Math.random() * 16) ];
            }
            return num
                ? this.getMultipleColors( num, this.getRandomColor )
                : clr;
        },

        getMultipleColors: function ( sum, mode ) {
            if ( sum && typeof mode === 'function' ) {
                var i, result=[];
                while ( result.length < sum ) {
                    result.push( mode() );
                    $.unique(result)
                }
                return result;
            }
            return this.getRandomColor();
        },

    };

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    win. Date. prototype. Format = function (fmt) {
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
        getMostElementInArray: function (arr) {
            if ( !arr.length ) return;
            var res = {};
            // 遍历数组
            for ( var i = 0, l = arr.length; i < l; i++ ) {
                if (!res[arr[i]]) {
                    res[arr[i]] = 1
                } else {
                    res[arr[i]]++
                }
            }
            // 遍历 res
            var keys = Object.keys(res),
                maxNum = 0,
                maxEle;

            for ( var i = 0, l = keys.length; i < l; i++ ) {
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
            var i, j,
                tempArray1 = [],
                result = [];
            if ( _Z. Checker. isEmpty( from ) ) return target;
            for ( i = 0; i < from.length; i++ ) {
                tempArray1[ from[i] ] = true;
            }
            for ( j = 0; j < target.length; j++ ) {
                if( !tempArray1[ target[j] ] ) {
                    result.push( target[j] );
                }
            }
            return result;
        },

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

        regroupArrayByKey: function ( data ) {
            var outer = {},
                _this = '';
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
        }
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

        dateFormat: function ( date, fmt ) {
            return new Date( date ).Format( fmt || 'yyyy-MM-dd hh:mm:ss' );
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

        replaceAll: function( s1, s2 ){
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

        isStartWith: function (content, searchVal) {
            return content.indexOf(searchVal) === 0;
        },

        getEmployeeType: function (content) {
            return content
                ? this. isStartWith( content.toLowerCase(), 'wb' ) ? '外包' : '自营'
                : '';
        }
    };

    /**
     * echart
     */
    _Z. eChart = {
        line: function (conf) {
            if ( !conf && _Z.Checker.getType( conf ) !== 'object' ) return;

            var container = document.getElementById(conf.id);

            $(container).removeAttr('_echarts_instance_').html('');

            var myChart = echarts.init( container );

            // 设置轴线和轴线文字的颜色
            // var color = typeof conf.clr !== 'string' ? conf.clr[ conf.clr.length - 1 ] : conf.clr;
            var color = '#FFF',
                yOpts = {
                    splitLine:{ lineStyle: { color: '#DDD', opacity: .4 } },
                    axisLine: {  lineStyle: { color: color } }
                },

                yAxis = conf.yAxis || yOpts;

            myChart.setOption({
                title: conf.title || {},
                color: conf.clr,
                grid: conf.grid,
                legend: conf.legend || {},
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                textStyle: { color: color },
                xAxis: {
                    axisLine: { lineStyle: { color: color } },
                    data: conf.dataX
                },
                yAxis: yAxis,
                series: conf.series,

            });
            return myChart;
        },

        pies: function (conf) {
            if ( !conf && _Z.getType( conf ) !== 'object' ) return;

            var data = [];
            // key转化为 name 和 value
            $.each(conf.data,function () {
                var pack = {};
                $.each(this,function (k, v) {
                    if ( !isNaN( v ) ) {
                        pack.value = v;
                        return true;
                    }
                    pack.name = v
                });
                data.push(pack);
            });

            var container = document.getElementById(conf.id);

            $(container).removeAttr('_echarts_instance_').html('');

            var myChart = echarts.init( container );
            myChart.setOption({
                color: _Z. style. getRandomColor(10),
                title: {
                    text: conf.title,
                    x: 'center',
                    textStyle: {
                        color: '#ccc'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series: [{
                    name: conf.title,
                    type: 'pie',
                    radius: [25 , 130],
                    center: ['50%', '50%'],
                    data: data,
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.6)'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 5,
                            length2: 5
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }]
            });
        }

    };


    /**
     * 校验器
     */
    _Z. Checker = {
        getType: function () {
            return Object.prototype.toString.call(arguments[0] || undef).slice(8, -1).toLowerCase();
        },

        isPlainObject: function ( obj ) {
            return _Z.Checker.getType( obj ) === 'object';
        },

        isContains: function( str, substr ){
            return str.indexOf(substr) >= 0;
        },

        isEmpty: function( obj ) {
            var is = true;
            if ( !obj ) return is;
            var type = _Z.Checker.getType( obj );
            switch ( type ) {
                case 'object':
                    var p;
                    for ( p in obj ) {
                        is = !is;
                        break;
                    }
                    return is;
                case 'array':
                    return obj.length === 0;
                default:
                    return;
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
                if ( !this.value ) {
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
            if( ! this.isPlainObject (obj) )
                throw 'arguments error';
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
        },

        setSession: function (json, name) {
            sessionStorage[name] = JSON.stringify(json);
        },

        getSession: function (name) {
            return JSON.parse( sessionStorage[name] );
        }

    };


    // this innerStatic data should be used only the library internally.
    // like any frame configs, initialized options inside the file.
    // it is strongly suggested not to put any given projects options data
    // in this object by changing the source code
    // you can mount any static data in this object in your project files instead of putting in here
    _Z. innerStatic = {
        error: {
            args: 'arguments error'
        }
    };

    _Z. static = {

        method: {
            LACBCN: 'listAspClientByClientName',
            LAPBPN: 'listAspProjectByProjectName',

            LATCPW: 'listAccumulativeTotalClientProjectWorkday', // ymd week
            GICPW: 'getIncrementClientProjectWorday', // ymd week

            LPSD: 'listProjectStatusDistribution', //y-m-d 6-month
            LPTD: 'listProjectTypeDistribution', // y-m-d 6-month

            LCRC: 'listClientResourceCollection', // y-m-d 6-month
            LGA: 'listGaapAccumulate', // ymd week
            LGAP: 'listGaapAccumulateProject', // ymd week

            LPCBE: 'listProjectCollectionByEmployee', // y-m-d 6-month
            LPCBC: 'listProjectCollectionByClient', // 同上
            LECBP: 'listEmpCollectionByProject', // 同上
        },

        getRequestDate: function (type, range) {
            var now = _Z. Format.getDateFromNow('d1'),
                week = _Z. Format.getDateFromNow('d7'),
                halfYear = _Z. Format.getDateFromNow('m6'),

                weekRange = week + ' - ' + now,
                halfYearRange = halfYear + ' - ' + now;

            switch ( type ) {
                case 'ymd':
                    return this.getTimeParams ( weekRange, type );
                case 'y-m-d':
                    return this.getTimeParams ( halfYearRange, type );
                default:
                    return this.getTimeParams ( halfYearRange, 'y-m-d' )
            }
        },

        getTimeParams: function ( time, type ) {
            var timeArray = time.split(' - '),
                s = timeArray[0],
                e = timeArray[1];

            if (!type || type === 'y-m-d') {
                s += ' 00:00:00';
                e += ' 00:00:00';
            }
            else if (type === 'ymd') {
                s = s.replace(/-/g, '');
                e = e.replace(/-/g, '');
            }

            return {
                start_time: s,
                end_time: e
            }
        }

    };

    var Z = {};

    // conform all the child nodes of child nodes to child nodes;
    _Z. extend = function () {
        var s, vType;

        for ( s in this ) {
            var value = this[ s ];
            if ( _Z .Checker .hasProperty( Z, s ) ) {
                throw 'The key name \' ' + s + ' \' has been occupied!';
            }

            // load the static data go straight
            if ( s === 'static' && _Z.dataTool.length( value ) !== 0 ) {
                Z[ s ] = value;
                continue;
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
                    _Z.extend.call( value );
                    break;
                default:
            }
        }
    };

    _Z.extend.call( _Z );

    win .Z  =  Z;

    return Z;

})(window, typeof jQuery !== 'undefined' ? jQuery : undefined);

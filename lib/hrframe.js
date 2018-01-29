/**
 * HRFrame 4
 * $f(function(){}) //柯理化函数
 * $f("") //调用函数
 * $f({}) //配置，缓存操作
 * Created by kingd on 2016/11/2.
 */
(function(window, document) {
    "use strict";
    window._ = undefined;
    //----$f core---------------------------
    var _$f = function() {
        var HRFrameValues = {
            "root": "app",
            "splitChar": /\./g,
            "plugin_path":{
                "simple":"__",
                "plugin":[/__\./g,/__,/g,/__/g]
            },
            "TEST":{}
        };
        var HRFrameFunctions = {};
        HRFrameFunctions["df"] = function(_name, _fn) {
            HRFrameFunctions[_name] = _fn;
        };
        HRFrameFunctions["curry"] = function(_fn) {
            //需要的形参长度
            var argumentsLength = _fn.length;
            //暂存形参
            var arg = [];
            var rtnFn = function() {
                //真实的形参长度
                var realLength = 0;
                //去掉不可用形参后真实的形参长度
                for (var i = 0; i < arguments.length; i++) {
                    arguments[i] !== undefined ? realLength++ : 0;
                }
                //是否满足可调用的形参长度
                if (realLength + arg.length >= argumentsLength) {
                    var realarg = [].concat(arg);
                    //这里使用重新生成的形参列表，为了保证最后一次调用不会暂存形参
                    for (var i = 0; i < arguments.length; i++) {
                        var j = realarg.indexOf(undefined);
                        j = j > 0 ? j : realarg.length;
                        if (arguments[i] !== undefined) {
                            realarg[j] = arguments[i];
                        }
                    }

                    return _fn.apply(HRFrameValues, realarg);
                }
                //暂存形参
                for (var i = 0; i < arguments.length; i++) {
                    var j = arg.indexOf(undefined);
                    j = j > 0 ? j : arg.length;
                    if (arguments[i] !== undefined) {
                        arg[j] = arguments[i];
                    }
                }

                if (arg.length < argumentsLength) {
                    return rtnFn;
                }
            };
            return rtnFn;
        };

        return function() {
            switch (typeof(arguments[0])) {
                case "object":
                    break;
                case "function":
                    return $f("curry", arguments[0]);
                    break;
                case "string":
                    var args = Array.apply({}, arguments);
                    var params = args.slice(1);
                    if (HRFrameFunctions[args[0]] == undefined) {
                        var newFN = $f("loadFNSync", args[0]);
                    }
                    return (HRFrameFunctions.curry(HRFrameFunctions[args[0]])).apply(HRFrameValues, params);
                    break;
                default:
            }
        };
    };

    var $f = window.$f = _$f();
})(window, document);

/**
 * $f("ajax.get",url,data,_fn[,p1,p2,...]);
 * url:远程地址,如果写null,则直接调用回调函数
 * data:json,请求远程地址的参数
 * _fn:回调函数,如果是一个字符串,则使用hrframe去执行目标字符串所代表的的函数
 * p1,p2,...:补充参数,回调成功后会将补充参数当做形参一同传给回调函数.
 **/
$f("df", "ajax.get", function(_url, _data, _fn) {
    var args = Array.apply({}, arguments);
    var params = args.slice(3);
    var callbackdata = null;
    var callback = null;
    var HRFrameValues = this;

    if (typeof(_fn) == "string") {
        callback = function(_data) {
            params.unshift(_data || callbackdata || null);
            params.unshift(_fn);
            $f.apply(HRFrameValues, params);
        };
    } else {
        callback = function(_data) {
            params.unshift(_data || callbackdata);
            _fn.apply(args, params);
        };
    }
    if (_url == null) {
        console.warn("ajax请求使用了空的url地址");
        return callback;
    } else {
        if (_url.indexOf(".yml") > 0) {
            var yml_url_name = _url.split(".yml")[0];
            for(var yml_name in HRFrameValues.TEST){
                if(HRFrameValues.TEST[yml_name].url==yml_url_name){
                    callbackdata = HRFrameValues.TEST[yml_name].rtn;
                }
            }
            if (callbackdata != undefined) {
                return callback;
            }else{
                return function() {
                    $.ajax({
                        url: _url,
                        data: _data,
                        method: "GET",
                        success: callback
                    });
                };
            }
        } else {
            return function() {
                $.ajax({
                    url: _url,
                    data: _data,
                    method: "GET",
                    success: callback
                });
            };
        }
    }
});
$f("df", "ajax.post", function(_url, _data, _fn) {
    var args = Array.apply({}, arguments);
    var params = args.slice(3);
    var callback = null;
    var HRFrameValues = this;
    if (typeof(_fn) == "string") {
        callback = function(_data) {
            params.unshift(_data || null);
            params.unshift(_fn);
            $f.apply(HRFrameValues, params);
        };
    } else {
        callback = function(_data) {
            params.unshift(_data);
            _fn.apply(args, params);
        };
    }
    if (_url == null) {
        return callback;
    } else {
        return function() {
            $.ajax({
                url: _url,
                data: _data,
                method: "POST",
                success: callback
            });
        };
    }
});
$f("df", "ajax.put", function(_url, _data, _fn) {
    var args = Array.apply({}, arguments);
    var params = args.slice(3);
    var callback = null;
    var HRFrameValues = this;
    if (typeof(_fn) == "string") {
        callback = function(_data) {
            params.unshift(_data || null);
            params.unshift(_fn);
            $f.apply(HRFrameValues, params);
        };
    } else {
        callback = function(_data) {
            params.unshift(_data);
            _fn.apply(args, params);
        };
    }
    if (_url == null) {
        return callback;
    } else {
        return function() {
            $.ajax({
                url: _url,
                data: _data,
                method: "PUT",
                success: callback
            });
        };
    }
});
$f("df", "ajax.delete", function(_url, _data, _fn) {
    var args = Array.apply({}, arguments);
    var params = args.slice(3);
    var callback = null;
    var HRFrameValues = this;
    if (typeof(_fn) == "string") {
        callback = function(_data) {
            params.unshift(_data || null);
            params.unshift(_fn);
            $f.apply(HRFrameValues, params);
        };
    } else {
        callback = function(_data) {
            params.unshift(_data);
            _fn.apply(args, params);
        };
    }
    if (_url == null) {
        return callback;
    } else {
        return function() {
            $.ajax({
                url: _url,
                data: _data,
                method: "DELETE",
                success: callback
            });
        };
    }
});

/**
  * $f("loadFNSync") //hrframe内部使用,不建议外部调用
  *
  * $f("->",fn1,fn2,fn3,..)
  * fn1,fn2,fn3...:将多个单一形参,单一返回值的纯函数串联成调用链,返回串联后的新函数
  *
  * $f("ajax.syncget") //内部使用,不建议外部调用
   **/




//加载远程函数
$f("df", "loadFNSync", function(_uri) {
    var setName = $f(function(filename, jscode) {
        return jscode.replace($f("get","plugin_path").simple, "'" + filename + "'");
    });
    setName = setName(_uri);
    var addAnnotation = $f(function(filename, jscode) {
        return jscode + "\n\n //# sourceURL=" + filename + ".js";
    });
    addAnnotation = addAnnotation(_uri);
    var evalCode = $f(function(jscode) {
        var fn = new Function(jscode);
        fn();
    });
    var fileURL = $f(function(HRFrameConfig, _fileName) {
        return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/") + ".js?time" + new Date().getMilliseconds();
    });
    fileURL = fileURL(this);
    var evalFile = $f("->", setName, addAnnotation, evalCode);
    var query = $f("ajax.syncget", fileURL(_uri), {}, evalFile);
    query();
});
$f("df", "ajax.syncget", function(_url, _data, _fn) {
    return function() {
        $.ajax({
            url: _url,
            data: _data,
            method: "GET",
            async: false,
            dataType: "text",
            success: _fn
        });
    };
});

/***
   * 注册href直接调用hrfram的形式
   * http://localhost/abc#f->fnA 1 2 3
   * 等同于  $f("fnA",1,2,3);
   * 增加这种表达式是为了方便浏览器后退按钮使用
   ***/
//#f-> xxxx xxx xxx
$(function() {
    window.addEventListener("hashchange", function(e) {
        var enewURL = "";
        if (e.newURL == undefined || e.newURL == null) {
            enewURL = decodeURI(location.hash); //兼容IE
        } else {
            enewURL = decodeURI(e.newURL);
        }
        var keyStr = enewURL.split("#f->")[1];
        if (keyStr != undefined) {
            var params = keyStr.split(" ");
            $f.apply(e, params);
        }
    }, false);
});

// plugin 参考 dist下面aovquestion示例
$f("df", "plugin", function(_path, _param) {
    var hrconfig = this;
    //获取页面
    var fileURL = $f(function(HRFrameConfig, _fileName) {
        return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/");
    });
    fileURL(hrconfig, _);
    var pluginargs = Array.apply({}, arguments);
    var getplugin = $f("ajax.getplugin", fileURL(_path) + "/plugin.html", pluginargs, function(_page) {
        var plugin_path = $f("get", "plugin_path").plugin;
        var _pageWithPath = _page.replace(plugin_path[0], _path + ".");
        _pageWithPath = _pageWithPath.replace(plugin_path[1], "'" + _path + "',");
        _pageWithPath = _pageWithPath.replace(plugin_path[2], "doc/"+_path);

        var template = _pageWithPath.slice(_pageWithPath.indexOf("<template>") + 10, _pageWithPath.indexOf("</template>"));
        var script = _pageWithPath.slice(_pageWithPath.indexOf("<script>") + 8, _pageWithPath.indexOf("</script>"));

        script = script + "\n\n //# sourceURL=" + _path + ".js";

        var evalCode = $f(function(jscode) {
            var fn = new Function(jscode);
            fn();
        });
        evalCode(script);
        this[0] = template;
        this.unshift(_path);
        $f.apply(hrconfig, this);
    });
    getplugin();
});

$f("df", "ajax.getplugin", function(_url, _data, _fn) {
    return function() {
        $.ajax({
            url: _url,
            method: "GET",
            context: _data,
            success: _fn
        });
    };
});

$f("df","plugin.test",function(_path){
    var HRconfig = this;
    $f("ajax.syncget",_path+"/doc.yml",null,function(_data){
        var doc = jsyaml.load(_data);
        HRconfig.TEST=doc;
    })();
});

//render,list 参考示例

    $f("df", "appendHTML", function(_selector, _content) {
        var id = $(_content).attr("id");
        if (id !== undefined && id !== null) {
            $("#" + id).remove();
            $(_selector).append(_content);
        } else {
            $(_selector).append(_content);
        }
    });
    //展示列表页面
    $f("df", "list", function(_path, _param) {
        var hrconfig = this;
        var args = Array.apply({}, arguments);
        args[0] = _path + ".list.req";
        var querydata = $f.apply(hrconfig, args);
        if (querydata != null) {
            var query = $f("ajax.get", querydata.url, querydata.data, function(_data) {
                //获取页面
                var fileURL = $f(function(HRFrameConfig, _fileName) {
                    return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/");
                });
                fileURL(hrconfig, _);
                var getPage = $f("ajax.get", fileURL(_path) + "/list.html", {}, function(_page) {
                    $f(_path + ".list.resp", _param, _page, _data);
                });
                getPage();
            });
            query();
        } else {
            //获取页面
            var fileURL = $f(function(HRFrameConfig, _fileName) {
                return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/");
            });
            fileURL(hrconfig, _);
            var getPage = $f("ajax.get", fileURL(_path) + "/list.html", {}, function(_page) {
                $f(_path + ".list.resp", _param, _page, null);
            });
            getPage();

        }
    });
    //render
    $f("df", "render", function(_path, _param) {
        var hrconfig = this;
        var args = Array.apply({}, arguments);
        args[0] = _path + ".req";
        var querydata = $f.apply(hrconfig, args);
        if (querydata == null) {
            //获取页面
            var fileURL = $f(function(HRFrameConfig, _fileName) {
                return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/");
            });
            fileURL(hrconfig, _);
            var getPage = $f("ajax.get", fileURL(_path) + "/i.html", {}, function(_page) {
                $f(_path + ".resp", _param, _page, null);
            });
            getPage();
        } else {
            var query = $f("ajax.get", querydata.url, querydata.data, function(_data) {
                //获取页面
                var fileURL = $f(function(HRFrameConfig, _fileName) {
                    return HRFrameConfig.root + "/" + _fileName.replace(HRFrameConfig.splitChar, "/");
                });
                fileURL(hrconfig, _);
                var getPage = $f("ajax.get", fileURL(_path) + "/i.html", {}, function(_page) {
                    $f(_path + ".resp", _param, _page, _data);
                });
                getPage();
            });
            query();
        }
    });

    $f("df", "->", function(_fn1, _fn2) {
        var args = Array.apply({}, arguments);
        return function(_para) {
            var rtnval = _para;
            for (var i = 0; i < args.length; i++) {
                rtnval = args[i](rtnval);
            }
            return rtnval;
        };
    });
    $f("df", "set", function(_name, _value) {
        this[_name] = _value;
        return this[_name];
    });

    $f("df", "get", function(_name) {
        return this[_name];
    });

    //tppl 模板引擎,模板字符串,数据对象,返回html字符串
    $f("df", "TPPL", function(tpl, _data) {
        var data = _data || {};
        if (typeof(data) != "object") {
            console.log("TPPL ->data is not JSON Object");
            return null;
        }
        var fn = function(d) {
            var i, k = [],
                v = [];
            for (i in d) {
                k.push(i);
                v.push(d[i]);
            };
            return (new Function(k, fn.$)).apply(d, v);
        };
        if (!fn.$) {
            var tpls = tpl.split('<oo>');
            fn.$ = "var $empty=''; var $reg = RegExp(/object|undefined|function/i); var $=''";
            for (var t in tpls) {
                var p = tpls[t].split('</oo>');
                if (t != 0) {
                    fn.$ += '=' == p[0].charAt(0) ?
                        "+($reg.test(typeof(" + p[0].substr(1) + "))?$empty:" + p[0].substr(1) + ")" :
                        ";" + p[0].replace(/\r\n/g, '') + "$=$";
                }
                // 支持 <pre> 和 [::] 包裹的 js 代码
                fn.$ += "+'" + p[p.length - 1].replace(/\'/g, "\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + "'";
            }
            fn.$ += ";return $;";
            // log(fn.$);
        }
        return data ? fn(data) : fn;
    });

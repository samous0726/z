// 1. 背景：通常我们用原生 Promise 实现类似功能：
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve('promise result');
    }, 1500)
}).then((res) => {
    console.log(res)
})

// 题目：请完成下面代码编写，让 A 类具有如上 Promise 功能：

// answer is:
class Promise_ {
    constructor(action) {
        this.status = 'pending';
        this.value = null;
        this.reason = null;
        this.resolveCallbacks = null;
        this.rejectCallbacks = null;
        const resolve = (value) => {
            if (this.status === 'pending') {
                this.value = value;
                this.status = 'fulfilled';
                this.resolveCallbacks && this.resolveCallbacks()
            }
        };
        const reject = (reason) => {
            if (this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.rejectCallbacks && this.rejectCallbacks()
            }
        };
        try {
            action(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then(resolve, rejected) {
        if (this.status === 'fulfilled') {
            resolve(this.value)
        } else if (this.status === 'rejected') {
            rejected(this.reason)
        } else if (this.status === 'pending') {
            this.resolveCallbacks = resolve
            this.rejectCallbacks = rejected
        }
    }
}


// 使用 case：
new Promise_((resolve, reject) => {
    setTimeout(() => {
        resolve('my promise')
    }, 2000)
}).then((result) => {
    console.log(result)
});

/**
 * 2. 实现一个自定义事件处理器 EventEmitter，要求具备如下功能：
     const event = new EventEmitter()
     function callback() {}
     // 绑定事件
     event.on(name, callback)
     // 绑定只会执行一次的事件
     event.once(name, callback)
     // 取消绑定
     event.off(name)
     // 触发事件
     event.trigger(name, data)
 */

// answer is:
class EventEmitter {
    constructor(el) {
        this.target = document.getElementById(el)
    }
    on(name, callback) {
        this.target.addEventListener(name, callback)
    }
    off (name, callback) {
        this.target.removeEventListener(name, callback);
    }
    once(name, callback) {
        const event = () => {
            this.off(name, event);
            callback()
        };
        this.on(name, event)
    }

}


// 3. 编写一段你认为很能代表你能力的代码（如有），可以是项目中常用或核心的代码。
function TEFinal(tpl, data){
    var fn =  function(d) {
        return ( new Function('data', fn.$) ).call(d, d);
    };
    tpl = tpl.replace(/^\s+|\s+$/gm, '').replace(/\r\n/g, '').replace(/\n/g, '')
        .replace(/\r/g, '').replace(/(&lt;)/g, '<').replace(/(&amp;)/g, '&').replace(/(&gt;)/g, '>');
    var t = 0, tpls = tpl.split('<nb>');
    fn.$ = "var $reg = RegExp(/null|undefined/i); var T=''";
    for( ; t < tpls.length; t++ ) {
        var p = tpls[t].split('</nb>');
        if ( t !== 0 ) {
            fn.$ += '=' === p[0].charAt(0)
                ? '+($reg.test(typeof(' + p[0].substr(1) + ')) ? \'\' : ' + p[0].substr(1) + ')'
                : ';' + p[0] + 'T=T';
        }
        fn.$ += "+'" + p[ p.length - 1 ] + "'";
    }
    fn.$ += ";return T;";
    fn.$ += '\n //@ sourceURL=TEFinal.js';
    return data ? fn(data) : fn;
}
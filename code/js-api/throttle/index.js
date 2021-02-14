/**
 * @file 节流函数
 * 
 * 注意事项
 */

function throttle (fn, timer, options) {
    var prevTime = 0;
    var ctx, args;
    var timeout = null;
    options = options || {
        
        // 禁用第一次执行
        leading: false,

        // 停止触发的回调函数
        trailing: false
    }

    var throttled = function () {
        ctx = this;
        args = arguments;

        var currentTime = new Date().getTime();

        // 如果首次不触发，这里将prevTime赋值为currentTime
        if (!prevTime && options.leading === false) {
            prevTime = currentTime;
        }

        // 触发下一次记事件的剩余时间
        var remaining = timer - (currentTime - prevTime);

        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            prevTime = currentTime;
            fn.apply(ctx, args);
            
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(function () {
                prevTime = options.leading === false ? 0 : new Date().getTime();
                fn.apply(ctx, args);
                timeout = null;
            }, timer);
        }
    }

    throttled.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
        prevTime = 0;
    }

    return throttled;
}

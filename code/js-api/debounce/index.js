/**
 * @file 防抖函数
 * 
 * 实现要点：执行上下文、参数、xx时间内执行一次
 */

function debounce (fn, timer, immediate) {
    var timemout, result;

    var debounced = function debounced () {
        var ctx = this;
        var args = arguments;

        timemout && clearTimeout(timemout);

        if (immediate) {
            var callNow = !timemout;

            timemout = setTimeout(function () {
                timemout = null;
            }, timer);

            if (callNow) {
                result = fn.apply(ctx, args);
            }
        } else {
            timemout = setTimeout(function () {
                fn.apply(ctx, args);
            }, timer);    
        }

        return result;
    }

    debounced.cancel = function () {
        clearTimeout(timemout);
        timemout = null;
    }

    return debounced;
}
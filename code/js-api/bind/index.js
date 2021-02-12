/**
 * @file bind 源码实现
 * 
 * 通过apply实现
 */

Function.prototype.myBind = function myBind () {
    let ctx = Array.prototype.shift.call(arguments);
    let fn = this;

    return function () {
        return fn.apply(ctx, arguments);
    }
}

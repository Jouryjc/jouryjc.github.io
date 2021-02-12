/**
 * @file 实现 apply 函数
 * 
 * 1. 修改函数执行上下文（通过将函数挂载定义的上下文中）
 * 2. 第二个参数是数组
 */

Function.prototype.myApply = function myApply (ctx, args) {
    let context = ctx || window;

    Reflect.defineProperty(context, 'myFn', {
        value: this
    });

    let result = context.myFn(...args);

    Reflect.deleteProperty(context, 'myFn');

    return result;
}
/**
 * @file 实现 call 函数
 * 
 * 1. 能够修改函数的执行上下文，注意上下文为 null 时默认指向 window
 * 2. 接收参数
 */

Function.prototype.myCall = function myCall (ctx, ...args) {
    let self = ctx || window;

    Reflect.defineProperty(self, 'myFunc', {
        value: this
    })

    let result = self.myFunc(...args);

    // 删除副作用属性
    Reflect.deleteProperty(self, 'myFunc');

    return result;
}
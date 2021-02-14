/**
 * @file 函数柯里化
 * 
 * 1. 如果参数的长度小于实际函数接收的长度，拼接参数
 * 2. 如果参数的长度大于等于函数实际接收的长度，执行调用函数
 */

function curry (func) {
    return function curried (...args) {
        if (args.length >= func.length) {
            return func.apply(this, args);
        }
            
        return function pass (...args2) {
            return curried.apply(this, Array.prototype.concat.call(args, args2));
        }
    }
}
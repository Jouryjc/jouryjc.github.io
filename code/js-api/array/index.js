/**
 * @file Array 的各种API实现
 * 
 */

/**
 * 判断是不是数组
 */
export function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object, Array]';
}

/**
 * reduce 的实现
 * 
 * @param {any} initValue
 * @param {any} currentValue
 * 
 * 1. 定义一个结果变量
 * 2. 循环数组项，依次执行函数
 * 3. 返回结果变量
 */

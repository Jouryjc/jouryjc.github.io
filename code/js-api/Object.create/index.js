/**
 * @file 实现 Object.create 函数
 * 
 * 1. 原型式继承
 * 
 */

function myObjectCreate (obj) {
    function F () {};
    
    F.prototype = obj;

    return new F();
}
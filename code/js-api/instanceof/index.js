/**
 * @file instanceof 源码实现
 * 
 * 1. 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
 */

function myInstanceof (left, right) {
    var rightProto = right.prototype;
    var leftProto = Reflect.getPrototypeOf(left);

    while (true) {
        if (leftProto === null) {
            return false;
        }

        if (leftProto === rightProto) {
            return true;
        }

        leftProto = Reflect.getPrototypeOf(leftProto);
    }
}
/**
 * @file 实现一个new函数
 * 
 * 1. 创建一个空的对象
 * 2. 链接该对象到另一个对象
 * 3. 将步骤1创建的对象作为this上下文
 * 4. 如果该函数没有返回值，就返回 this
 */

function myNew() {

    // 1. 创建一个空的对象
    let obj = new Object();

    // 2. 链接该对象到另一个对象
    let Ctor = [].shift.call(arguments);
    Reflect.setPrototypeOf(obj, Ctor.prototype);

    // 3. 将步骤1创建的对象作为this上下文
    let result = Ctor.apply(obj, arguments);

    // 如果该函数没有返回值，就返回 this
    return typeof result === 'object' ? result : obj;
}
/**
 * @file JS 实现 OOP 的几种方式
 */

/**
 * 原型链继承
 * 
 * 优点：能访问原型链上的方法
 * 缺点：实例上的引用属性共享
 */
function Parent () {
    this.name = 'father';
    this.interestings = [];
}

Parent.prototype.sayName = function sayName () {
    console.log(this.name);
}

function Child () {
    this.age = 14;
}

Child.prototype = new Parent();

let c1 = new Child();
let c2 = new Child();

c1.interestings.push('basketball')

console.log(c2);

/**
 * 构造函数继承
 * 
 * 优点：实例上的属性独立，能够传参
 * 缺点：子类访问不了父类原型上的方法
 */
function A (name) {
    this.name = name;
    this.interets = [];
}

A.prototype.sayHello = function sayHello () {
    console.log('hello');
}

function B (name) {
    A.call(this, name);
}

let b1 = new B('b1');
let b2 = new B('b2');

b1.interets.push('tableTennis');
console.log(b2.interets);
console.log(b1.interets);

/**
 * 组合式继承
 * 
 * 优点：弥补了原型链继承和构造器继承的缺点，比较常用的继承方法
 * 缺点：会调用两次父类构造函数
 */

function C () {
    this.name = 'c';
}

C.prototype.sayC = function sayC () {
    console.log('hello, compose')
}

function D () {
    C.call(this);
}

D.prototype = new C();
D.prototype.constructor = D;

let d1 = new D();
let d2 = new D();

console.log(d1.name);
d1.sayC();

/**
 * 原型式继承 -- Object.create()
 * 
 * 优点：能够访问原型链和实例属性
 * 缺点：引用类型属性指向相同的内存空间
 */

function myObjectCreate (obj) {
    function Fn () {}
    obj.prototype = Fn;

    return new Fn();
}

/**
 * 寄生式继承
 * 
 * 优点：可以在父类的继承上面添加其他方法
 */

/**
 * 寄生组合式继承
 * 最优的继承方式
 */
function E (name) {
    this.name = name;
}

E.prototype.sayE = function sayE () {
    console.log(this.name);
}

function F (name) {
    E.call(this, name);
}

let prototype = E.prototype;
prototype.constructor = F;
F.prototype = prototype;

let f1 = new F('f1');
let f2 = new F('f2');

console.log(f1, f2.sayE())

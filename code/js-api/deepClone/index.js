/**
 * @file 深拷贝
 */

import { isPlainObject } from "../utils/typeof.js"; 

// jQuery
export function extend () {
    
    // 默认浅拷贝
    var deep = false;
    var name, options, copy, src, clone, copyIsArray, copy;
    var length = arguments.length;

    // 第二个参数是目标对象
    var i = 1;

    // $.extend(target, ...options)
    // 第一个参数如果不是布尔值，就初始化
    var firstParamIsBoolean = typeof arguments[0] === 'boolean';
    var target = {};

    if (firstParamIsBoolean) {
        deep = arguments[0];
        target = arguments[i];
        i++;
    }

    if (typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }

    for (; i < length; i++) {
        options = arguments[i];

        if (options != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];

                // 循环引用
                if (src === copy) {
                    continue;
                }

                copyIsArray = Array.isArray(copy);

                // 深拷贝
                if (deep && copy && (isPlainObject(copy) || copyIsArray)) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}
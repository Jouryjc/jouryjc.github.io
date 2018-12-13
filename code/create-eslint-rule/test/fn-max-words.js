'use strict';

const rule = require('../eslint-rules/fn-max-words');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
    env: {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    }
});

ruleTester.run("fn-max-words", rule, {

    valid: [
        {
            code: `function validTest() {var a = 1; var b = 2;}`,
            options: [2]
        }
    ],

    invalid: [
        {
            code: `var c = function c() {
                console.log('ccc'); var a = 1; var b = 3;
                var sad = 1;
            }`,
            options: [2],
            errors: [{
                message: '函数 c 当前语句数 4 已超出限制，最大语句数为2',
                type: "FunctionExpression"
            }]
        },
        {
            code: `var abc = function() {
                console.log('ccc'); var a = 1; var b = 3;
                var sad = 1;
            }`,
            options: [2],
            errors: [{
                message: '函数 abc 当前语句数 4 已超出限制，最大语句数为2',
                type: "FunctionExpression"
            }]
        },
        {
            code: `function b() {
                console.log('ccc'); var a = 1; var b = 3;
                var sad = 1;
            }`,
            options: [2],
            errors: [{
                message: '函数 b 当前语句数 4 已超出限制，最大语句数为2',
                type: "FunctionDeclaration"
            }]
        }
    ]
});
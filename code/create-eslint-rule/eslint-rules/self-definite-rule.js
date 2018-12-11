/**
 * 自定义Eslint规则
 * @author Jouryjc
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "文件路径错误，请确认大小写",
        }
    },
    create: function (context) {

        console.log(context);

        return {
            // callback functions
            CallExpression: function (node) {
                debugger
                console.log(node)
            },

            Identifier: function (node) {

            }
        };
    }
};
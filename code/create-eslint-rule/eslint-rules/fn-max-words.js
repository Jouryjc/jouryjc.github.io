/**
 * @file 函数体代码行数限制
 */

'use strict';

module.exports = {
    meta: {
        docs: {
            description: '强制函数体代码语句数'
        },
        schema: [
            {
                type: 'integer',
                minimum: 0
            }
        ]
    },

    create: function (context) {

        // 未传参数时默认100条语句
        let max = context.options[0] || 100;

        /**
         * 验证函数体代码语句数是否符合规则
         * @param {ASTNode} node
         */
        function valid(node) {
            let count = node.body.body.length;

            if (count > max) {

                let fnName = getFnName(node);

                context.report({
                    node: node,
                    message: '函数 {{name}} 当前语句数 {{count}} 已超出限制，最大语句数为{{max}}',
                    data: {
                        count: count,
                        max: max,
                        name: fnName
                    }
                });
            }
        }

        /**
         * 获取函数名称
         * @param {ASTNode} node
         * @returns name
         */
        function getFnName(node) {

            // 函数声明直接返回名称
            if (node.type === 'FunctionDeclaration') {
                return node.id.name;
            }

            // 函数函数名称的函数表达式
            if (node.id && node.id.name) {
                return node.id.name;
            }

            // 匿名函数的函数表达式
            return node.parent.id.name;

        }

        return {
            FunctionExpression: valid,
            FunctionDeclaration: valid
        };
    }
};

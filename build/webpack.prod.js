const WebpackCommon = require('./webpack.common')
const merge = require('webpack-merge')
const getRootPath = require('./utils').getRootPath
const HtmlWebpackPlugin = require('html-webpack-plugin')
const buildConfig = require('../config').client.build

module.exports = merge(WebpackCommon, {
    mode: 'production',

    output: {
        filename: '[name]-[chunkhash].js',
        path: getRootPath('/dist/client'),
        publicPath: buildConfig.publicPath
    },

    // 控制如何生成 source map
    devtool: buildConfig.devtoolType,

    plugins: [
        new HtmlWebpackPlugin({
            filename: getRootPath('dist/client/index.html'),
            template: getRootPath('src/client/index.html'),
            inject: true,
            //压缩配置
            minify: {
                //删除Html注释
                removeComments: true,
                //去除空格
                collapseWhitespace: true,
                //去除属性引号
                removeAttributeQuotes: true
            },
        })
    ]
});
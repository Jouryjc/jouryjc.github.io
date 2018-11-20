const WebpackCommon = require('./webpack.common')
const merge = require('webpack-merge')
const getRootPath = require('./utils').getRootPath
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(WebpackCommon, {
    mode: 'production',

    output: {
        filename: '[name]-[chunkhash].js',
        path: getRootPath('/dist/client'),
        publicPath: '/client/'
    },

    devtool: 'source-map',

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
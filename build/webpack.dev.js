const WebpackCommon = require('./webpack.common')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const getRootPath = require('./utils').getRootPath

module.exports = merge(WebpackCommon, {

    mode: 'development',

    output: {
        filename: '[name]-[hash].js',
        publicPath: '/'
    },

    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: getRootPath('dist'),
        host: 'localhost',
        port: '3333',
        open: true,
        inline: true,
        hot: true,

        // 在浏览器上全屏显示编译的errors或warnings
        overlay: {
            errors: true,
            warnings: false
        },

        proxy: {
            '/api': {
                target: 'http://localhost:8888',
                pathRewrite: { '^/api': '' },
                changeOrigin: true
            }
        }
    },

    plugins: [

        // 热替换
        new webpack.HotModuleReplacementPlugin(),

        // 配置html入口信息
        new HtmlWebpackPlugin({
            title: 'vue-express-mongo-demo',
            filename: 'index.html',
            template: 'src/client/index.html',
            inject: true
        }),
    ]
});
const WebpackCommon = require('./webpack.common')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const getRootPath = require('./utils').getRootPath
const devConfig = require('../config').client.dev

module.exports = merge(WebpackCommon, {

    mode: 'development',

    output: {
        filename: '[name]-[hash].js',
        publicPath: devConfig.publicPath
    },

    devtool: devConfig.devtoolType,

    // 本地调试服务器
    devServer: {
        contentBase: getRootPath('dist'),
        // 主机名
        host: devConfig.host,
        // 端口号
        port: devConfig.port,
        // 自动打开浏览器
        open: true,
        // 自动刷新
        inline: true,
        // 热加载
        hot: true,
        // 终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
        quiet: true,
        // 在浏览器上全屏显示编译的errors或warnings
        overlay: {
            errors: true,
            warnings: false
        },
        //配置反向代理解决跨域
        proxy: devConfig.proxyTable
    },

    plugins: [

        // 热替换
        new webpack.HotModuleReplacementPlugin(),

        // 编译友好提示插件
        new FriendlyErrorsWebpackPlugin({

            compilationSuccessInfo: {
                messages: [`You application is running here http://${devConfig.host}:${devConfig.port}`],
            }
        }),

        // 配置html入口信息
        new HtmlWebpackPlugin({
            title: 'vue-express-mongo-demo',
            filename: 'index.html',
            template: 'src/client/index.html',
            inject: true
        }),
    ]
});
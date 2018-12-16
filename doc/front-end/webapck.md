# webpack构建项目
> Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 loader 的转换，任何形式的资源都可以视作模块，比如 CommonJS 模块、 AMD 模块、 ES6 模块、CSS、图片、JSON、coffeescript、LESS 等。

### 配置代码
#### webpack.common.js
> 开发和发布环境共用的配置

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { getRootPath, assetsPath } = require('./utils')

module.exports = {

    // 定义入口文件
    entry: {
        'app': getRootPath('src/client/src/main')
    },

    // 解析配置
    resolve: {

        // 自动解析确定的扩展，能够使用户在引入模块时不带扩展
        extensions: ['.js', '.vue'],

        // 路径缩写，确保项目中的模块引入更简单
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': getRootPath('src'),
            'components': getRootPath('src/client/src/components'),
            'util': getRootPath('src/client/src/util')
        }
    },

    // 模块解析
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 50000,
                    name: assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },

    plugins: [

        // https://vue-loader.vuejs.org/zh/guide/#vue-cli
        // 将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
        new VueLoaderPlugin()
    ],

    // 优化配置
    optimization: {

        // 多个入口抽取一个公共的运行时代码
        runtimeChunk: 'single',

        // 启动默认的代码分割配置项
        splitChunks: {
            chunks: 'all',

            // 指定生成名字中的分隔符
            automaticNameDelimiter: '~',

            // 自定义配置，主要使用它来决定生成的文件
            cacheGroups: {

                // 抽取公共代码的 chunk 名字
                vendors: {

                    // 一般使用正则表达式来匹配
                    test: /[\\/]node_modules[\\/]/,

                    // 抽取公共代码的优先级，数字越大，优先级越高
                    priority: -10
                }
            }
        }
    }
}
```
#### weipack.dev.js
> 开发环境特有的配置

```js
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
```

#### webpack.prod.js
> 发布环境特有的配置

```js
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
```
当然，上述配置中用到的一些工具函数和环境配置参数定义在 `build/utils.js` 和 `config/index.js` 中。

配置的方案需根据业务特定需求去完善，给出的是一个比较简单的 demo。
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
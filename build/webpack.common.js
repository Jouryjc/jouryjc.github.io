const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { getRootPath, assetsPath } = require('./utils')

module.exports = {
    entry: {
        'app': getRootPath('src/client/src/main')
    },

    resolve: {
        extensions: ['.js', '.vue'],

        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': getRootPath('src'),
            'components': getRootPath('src/client/src/components'),
            'util': getRootPath('src/client/src/util')
        }
    },

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
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: false
                    }
                }]
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
        new VueLoaderPlugin()
    ],

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    }
}
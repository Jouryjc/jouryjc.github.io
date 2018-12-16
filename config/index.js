/**
 * @file 基本配置文件
 */
module.exports = {

    // 客户端
    client: {

        // 开发环境
        dev: {
            publicPath: '/',

            // 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能
            devtoolType: 'cheap-module-eval-source-map',
            host: 'localhost',
            port: '3333',
            proxyTable: {
                '/api': {
                    target: 'http://localhost:8888',
                    pathRewrite: {
                        '^/api': ''
                    },
                    changeOrigin: true
                }
            }
        },

        // 线上环境
        build: {
            publicPath: '/client/',

            // 整个 source map 作为一个单独的文件生成
            devtoolType: 'cheap-module-source-map',
        }
    }
}
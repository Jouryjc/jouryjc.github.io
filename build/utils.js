const path = require('path');

// 封装成获取顶级根目录 
exports.getRootPath = function(dir) {
    return path.join(__dirname, '..', dir)
}

// 资源路径
exports.assetsPath = function(dir) {
    return path.posix.join('static', dir)
}
          /**
           * modules是存放所有模块的数组
           */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/  // 缓存对象，将已经加载过的模块存到这里，提升性能
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	/**
           * 模块加载函数
           * @param {Number} moduleId - 数组的下标index
           */
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
            // 已经加载过的模块，直接从缓存对象上面获取
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}

/******/ 		// Create a new module (and put it into the cache)
            // 如果模块不在缓存对象中，说明没有加载过
            // 新建一个模块，并存到缓存中
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,  // 模块id，即数组下标index
/******/ 			l: false,     // l=>loaded 是否已经加载过，首次这里为false
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
            // 从模块数组中拿到 index = moduleId 的项，再调用该函数
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
            // 将是否加载过的标志设置为 true
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
            // 返回模块的导出值
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
          // 将模块数组挂在 m 上
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
          // 将缓存对象挂在 c 上
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
          // 在 exports 对象上定义属性 __esModule 和 Symbol.toStringTag
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
          // 兼容性处理
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
          // 挂载 hasOwnProperty
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
          // webpack配置中的 publicPath
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
          // 加载入口模块并将 exports 对象返回去
          // 后面的 s 可以理解为 start，其实模块的意思
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/a.js":
/*!******************!*\
  !*** ./src/a.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        console.log('this is file a');

        // a 模块 export default 值为1
        /* harmony default export */ __webpack_exports__["default"] = (1);
        //# sourceURL=webpack:///./src/a.js?");

/***/ }),

/***/ "./src/b.js":
/*!******************!*\
  !*** ./src/b.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

        console.log('this is file b');
        module.exports = function () {
          console.log('this is function b');
        };
        //# sourceURL=webpack:///./src/b.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ "./src/a.js");
        var b = __webpack_require__(/*! ./b */ "./src/b.js");
        console.log(_a__WEBPACK_IMPORTED_MODULE_0__["default"], b);
        //# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });
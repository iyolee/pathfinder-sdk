
  /*!
  * pathfinder SDK v1.0.0
  * (c) 2020-2020
  * https://github.com/iyolee/pathfinder
  * Released under the MIT License.
  */

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function handleWindowError(_window, handleError, ctx) {
    _window.onerror = function (msg, url, line, col, error) {
      if (/Script error/.test(msg)) {
        handleError({
          title: 'Script error',
          msg: 'Script error',
          category: 'js',
          level: 'error'
        }, ctx);
        return;
      }

      if (error && error.stack) {
        handleError({
          title: msg,
          msg: error.stack,
          category: 'js',
          level: 'error'
        }, ctx);
      } else {
        handleError({
          title: msg,
          msg: JSON.stringify({
            resourceUrl: url,
            rowNum: line,
            colNum: col
          }),
          category: 'js',
          level: 'error'
        }, ctx);
      }
    };
  }
  function handleRejectedPromise(_window, handleError, ctx) {
    _window.addEventListener('unhandledrejection', function (event) {
      if (event) {
        var reason = event.reason || '';
        handleError({
          title: 'unhandledrejection',
          msg: reason,
          category: 'js',
          level: 'error'
        }, ctx);
      }
    });
  }
  function handleResourceError(_window, handleError, ctx) {
    _window.addEventListener('error', function (event) {
      if (event) {
        var target = event.target || event.srcElement;
        var isResourceTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement; // js error 不需要再处理

        if (!isResourceTarget) return;
        var url = target.src || target.href;
        handleError({
          title: target.nodeName,
          msg: url,
          category: 'resource',
          level: 'error'
        }, ctx);
      }
    }, true);
  }
  function handleVueError(_window, handleError, ctx) {
    var vue = _window.Vue;
    if (!vue || !vue.config) return;

    var VueErrorHandler = function VueErrorHandler(error, vm, info) {
      var metaData = {};
      var isComponentError = false;

      if (Object.prototype.toString.call(vm) === '[object Object]') {
        metaData.componentName = vm._isVue ? vm.$options || vm.$options._componentTag : vm.name;
        metaData.propsData = vm.$options.propsData;

        if (metaData.componentName || metaData.propsData) {
          isComponentError = true;
        }
      }

      var errMsg = isComponentError ? metaData : error;
      handleError({
        title: "Vue Error: ".concat(info),
        msg: errMsg,
        category: 'js',
        level: 'error'
      }, ctx);
    };

    Vue.config.errorHandler = VueErrorHandler;
  }

  var Pathfinder = /*#__PURE__*/function () {
    function Pathfinder(options) {
      _classCallCheck(this, Pathfinder);

      this.errorStack = [];
      this.initConfig(options);
      this.setup();
    }

    _createClass(Pathfinder, [{
      key: "initConfig",
      value: function initConfig(options) {
        var defaultConfig = {
          jsError: true,
          resourceError: true,
          consoleError: false,
          // console.error默认不处理
          scriptError: false,
          // 跨域js错误，默认不处理，因为没有任何信息
          vueError: true,
          autoReport: true,
          filters: [],
          // 过滤器，命中的不上报
          levels: ['info', 'warning', 'error'],
          category: ['js', 'resource', 'ajax']
        };
        this.config = _objectSpread2(_objectSpread2({}, defaultConfig), options);
      }
    }, {
      key: "setup",
      value: function setup() {
        var _window = typeof window !== 'undefined' ? window : {};

        this.registerError(_window);
      }
    }, {
      key: "registerError",
      value: function registerError(_window) {
        var _this$config = this.config,
            jsError = _this$config.jsError,
            resourceError = _this$config.resourceError,
            vueError = _this$config.vueError;

        if (jsError) {
          handleWindowError(_window, this.handleError, this);
          handleRejectedPromise(_window, this.handleError, this);
        }

        if (resourceError) {
          handleResourceError(_window, this.handleError, this);
        }

        if (vueError) {
          handleVueError(_window, this.handleError, this);
        }
      }
    }, {
      key: "handleError",
      value: function handleError(errorObj, ctx) {
        var autoReport = ctx.config.autoReport;

        if (autoReport) {
          ctx.sendError(errorObj);
        } // ctx.errorStack.push(errorObj);

      }
    }, {
      key: "sendError",
      value: function sendError(errorObj) {
        // TODO send error
        console.log("Pathfinder -> sendError -> errorObj", errorObj);
      }
    }], [{
      key: "getInstance",
      value: function getInstance(options) {
        if (!(this.instance instanceof this)) {
          this.instance = new this(options);
        }

        return this.instance;
      }
    }]);

    return Pathfinder;
  }();

  Pathfinder.getInstance();

})));
//# sourceMappingURL=pathfinder-sdk_v1.0.0.js.map

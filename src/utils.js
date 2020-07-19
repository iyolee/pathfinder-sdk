export function handleWindowError(_window, handleError, ctx) {
  _window.onerror = (msg, url, line, col, error) => {
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
  }
}

export function handleRejectedPromise(_window, handleError, ctx) {
  _window.addEventListener('unhandledrejection', event => {
    if (event) {
      const reason = event.reason || '';
      handleError({
        title: 'unhandledrejection',
        msg: reason,
        category: 'js',
        level: 'error'
      }, ctx);
    }
  })
}

export function handleResourceError(_window, handleError, ctx) {
  _window.addEventListener('error', event => {
    if (event) {
      const target = event.target || event.srcElement;
      const isResourceTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
      // js error 不需要再处理
      if (!isResourceTarget) return;
      const url = target.src || target.href;
      handleError({
        title: target.nodeName,
        msg: url,
        category: 'resource',
        level: 'error'
      }, ctx);
    }
  }, true)
}

export function handleConsoleError(_window, handleError, ctx) {
  if (!_window.console || !_window.console.error) return;

    _window.console.error = (...args) => {
      handleError({
        title: 'consoleError',
        msg: JSON.stringify(args.join(',')),
        category: 'js',
        level: 'error'
      }, ctx);
    };
}

export function handleVueError(_window, handleError, ctx) {
  const vue = _window.Vue;
  if (!vue || !vue.config) return;

  const VueErrorHandler = (error, vm, info) => {
    const metaData = {};
    let isComponentError = false;
    if (Object.prototype.toString.call(vm) === '[object Object]') {
      metaData.componentName = vm._isVue ? vm.$options || vm.$options._componentTag : vm.name;
      metaData.propsData = vm.$options.propsData;
      if (metaData.componentName || metaData.propsData) {
        isComponentError = true;
      }
    }
    const errMsg = isComponentError ? metaData : error;
    handleError({
      title: `Vue Error: ${info}`,
      msg: errMsg,
      category: 'js',
      level: 'error'
    }, ctx);
  };

  Vue.config.errorHandler = VueErrorHandler;
}

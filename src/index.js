import {
  handleWindowError,
  handleRejectedPromise,
  handleResourceError,
  handleVueError
} from './utils';

class Pathfinder {
  constructor (options) {
    this.errorStack = [];
    this.initConfig(options);
    this.setup();
  }
  static getInstance(options) {
    if (!(this.instance instanceof this)) {
      this.instance = new this(options)
    }
    return this.instance
  }
  initConfig(options) {
    const defaultConfig = {
      jsError: true,
      resourceError: true,
      consoleError: false, // console.error默认不处理
      scriptError: false, // 跨域js错误，默认不处理，因为没有任何信息
      vueError: true,
      autoReport: true,
      filters: [], // 过滤器，命中的不上报
      levels: ['info', 'warning', 'error'],
      category: ['js', 'resource', 'ajax']
    }
    this.config = {
      ...defaultConfig,
      ...options
    }
  }
  setup() {
    const _window = typeof window !== 'undefined'
    ? window
    : {};
    this.registerError(_window);
  }
  registerError(_window) {
    const { jsError, resourceError, vueError } = this.config;
    if (jsError) {
      handleWindowError.call(this, _window, this.handleError);
      handleRejectedPromise.call(this, _window, this.handleError);
    }
    if (resourceError) {
      handleResourceError.call(this, _window, this.handleError);
    }
    if (vueError) {
      handleVueError.call(this, _window, this.handleError);
    }
  }
  handleError(errorObj) {
    const { autoReport } = this.config;
    if (autoReport) {
      sendError.call(this, errorObj);
    }
    // ctx.errorStack.push(errorObj);
  }
  sendError(errorObj) {
    // TODO send error
    console.log("Pathfinder -> sendError -> errorObj", errorObj)
  }
}

Pathfinder.getInstance();

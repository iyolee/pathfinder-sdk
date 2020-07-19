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
  handleError(errorObj, ctx) {
    const { autoReport } = ctx.config;
    if (autoReport) {
      ctx.sendError(errorObj);
    }
    // ctx.errorStack.push(errorObj);
  }
  sendError(errorObj) {
    // TODO send error
    console.log("Pathfinder -> sendError -> errorObj", errorObj)
  }
}

Pathfinder.getInstance();

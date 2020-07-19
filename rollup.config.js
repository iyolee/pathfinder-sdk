import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const version = pkg.version;

// 代码头
const banner =`
  /*!
  * pathfinder SDK v${version}
  * (c) 2020-${new Date().getFullYear()}
  * https://github.com/iyolee/pathfinder
  * Released under the MIT License.
  */
`

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    file: `dist/pathfinder-sdk_v${version}.js`,
    name: 'pathfinder',
    ...(process.env.NODE_ENV === 'development' ? { sourcemap: true } : null),
    banner
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      __VERSION__: pkg.version
    }),
    resolve({
      browser: true,
    }),
    json(),
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    (process.env.NODE_ENV === 'production' && uglify()),
    livereload(),
    // 本地服务器
    serve({
      open: true,
      port: 8000, 
      openPage: '/test/index.html',
      contentBase: ''
    })
  ]
};
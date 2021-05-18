import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import visualizer from 'rollup-plugin-visualizer';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import html from '@rollup/plugin-html';
import pkg from './package.json';

const bothPlugins = [
  typescript({
    tsconfig: 'tsconfig.json',
    sourceMap: false,
  }),
  resolve(),
  commonJs(),
  terser(),
  visualizer(),
  sizeSnapshot(),
];

const devPlugins = [
  html({
    input: './src/index.html',
    scripts: [
      pkg.browser,
    ],
  }),
  serve({
    open: true,
    openPage: '/',
    host: 'localhost',
    port: 3003,
    contentBase: ['./dist'],
  }),
  livereload({
    watch: ['./example'],
    exts: ['html', 'js', 'css'],
  }),
];

const getPlugins = dev => {
  if (dev) {
    return bothPlugins.concat(devPlugins);
  }

  return bothPlugins;
};

export default (env) => {
  const { environment } = env;
  const dev = environment === 'dev';

  const umdFileName = dev ? `./example/${pkg.browser}` : `./${pkg.files[0]}/${pkg.browser}`;
  const esFileName = dev ? `./example/${pkg.module}` : `./${pkg.files[0]}/${pkg.module}`;


  return [
    // {
    //   input: 'src/polyfills.ts',
    //   output: [{ file: 'dist/polyfills.min.js', format: 'iife' }],
    //   plugins: getPlugins({ target: 'es5' }),
    // },
    {
      input: 'src/index.ts',
      output: [
        {
          name: 'Test',
          file: umdFileName,
          format: 'umd',
        },
        {
          file: esFileName,
          name: 'Test',
          format: 'es',
        },
      ],
      plugins: getPlugins(dev),
    },
    // {
    //   input: 'src/serviceworker.ts',
    //   output: [{ file: 'dist/serviceworker.min.js', format: 'iife' }],
    //   plugins: getPlugins({ target: 'es5' }),
    // },
    // {
    //   input: 'src/webworker.ts',
    //   output: [{ file: 'dist/webworker.min.js', format: 'iife' }],
    //   plugins: getPlugins({ target: 'es5' }),
    // },
  ];
};

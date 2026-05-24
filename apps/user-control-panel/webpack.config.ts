/* eslint-disable */
const { join } = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const webpack = require('webpack');
const { ServicesConfigs } = require('../../libs/configs/dist/src');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const configs = new ServicesConfigs(join(__dirname, '../..'));

console.log('configs========================', configs.get('API_BASE_URL'));

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/user-control-panel'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: true
  },
  ignoreWarnings: [
    /Failed to parse source map/,
    /ENOENT: no such file or directory/
  ],
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/app/index.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      // styles: ['./src/styles.scss'],
      styles: ['./src/index.css'],
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react.svgr.com/
      // svgr: false
    }),
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(configs.get('API_BASE_URL') ?? ''),
    }),
  ],
};

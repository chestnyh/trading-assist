/* eslint-disable */
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');
const webpack = require('webpack');
const { ServicesConfigs } = require('@trading-bot/configs');
const configs = new ServicesConfigs();
console.log("ggggggggggg =", configs.get('API_BASE_URL'));
console.log("ggggggggggg =", configs.get('ENV_FILE'));
console.log("ggggggggggg =", configs.get('NODE_ENV'));
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
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
    new webpack.DefinePlugin(() => {
      return {
        'process.env.API_BASE_URL': configs.get('API_BASE_URL')
      }
    }),
  ],
};

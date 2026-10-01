/* eslint-disable */
const { join } = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const webpack = require('webpack');
const { ServicesConfigs } = require('@trading-assist/configs');

// Configs load asynchronously, so export an async function:
// webpack-cli waits for it before building.
module.exports = async () => {
  const configs = await new ServicesConfigs().setUp();

  return {
    output: {
      path: join(__dirname, '../../dist/apps/user-control-panel'),
    },
    devServer: {
      port: 4200,
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true,
      }
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
        'process.env.LOG_STREAM_BASE_URL': JSON.stringify(configs.get('LOG_STREAM_BASE_URL') ?? ''),
      }),
    ],
  };
};

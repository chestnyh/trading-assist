import { NxAppWebpackPlugin } from '@nx/webpack/app-plugin.js';
import { NxReactWebpackPlugin } from '@nx/react/webpack-plugin.js';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export default {
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
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
};

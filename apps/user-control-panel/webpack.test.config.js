const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/features/test/test-entry.tsx',
  output: {
    path: path.resolve(__dirname, 'dist-test'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.scss', '.css'],
    alias: {
      '@trading-bot/api-client': path.resolve(__dirname, 'src/mocks/api-client.ts'),
      '@trading-bot/api-validator': path.resolve(__dirname, 'src/mocks/api-validator.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.test.json',
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/features/test/test-template.html',
    }),
  ],
  devServer: {
    port: 4200,
    hot: true,
  },
};

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { EnvironmentPlugin } = require("webpack")

module.exports = (env, argv) => {
  const develop = argv.mode === 'development';

  const devServer = develop ?
    {
      host: 'localhost',
      port: 3000,
      historyApiFallback: true,
      compress: true,
      hot: true,
    } : undefined;

  const devtool = develop ? 'source-map' : undefined;

  return {
    entry: './src',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [{
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        include:  path.resolve(__dirname, 'src'),
        options: {
          loader: "tsx",
          target: "es2015"
        }
      }, {
        test: /\.css$/i,
        use: [
          develop ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader', {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv({ stage: 0 })],
              },
            },
          }],
      }],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devtool,
    devServer,
    target: 'web',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
      }),
      !develop && new MiniCssExtractPlugin(),
      !develop && new CopyPlugin({
        patterns: [
          { from: 'public' },
        ],
      }),
      new EnvironmentPlugin({
        NODE_ENV: argv.mode
      })
    ].filter(Boolean),
  };
};

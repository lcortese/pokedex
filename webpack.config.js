const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {
  const develop = argv.mode === 'development';

  const devServer = develop ?
    {
      host: 'localhost',
      port: 3000,
      compress: true,
      hot: true,
    } : undefined;

  const devtool = develop ? 'source-map' : undefined;

  return {
    entry: './src',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{
        test: /\.(ts|tsx)?$/,
        include:  path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
      }, {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
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
      devServer && new ForkTsCheckerWebpackPlugin()
    ].filter(Boolean),
  };
};

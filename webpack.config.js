const webpack = require('webpack');
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    popup: ['babel-polyfill', "./app/index.js"],
    background: "./app/background/index.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015'],
          plugins: ['add-module-exports']
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: "file-loader?name=/images/[name].[ext]"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },
  watchOptions: {
    poll: true
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        warnings: false,
        screw_ie8: true
      },
      comments: false
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'options.html',
      chunks: ['popup'],
      template: './app/static/options.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'popup.html',
      chunks: ['popup'],
      template: './app/static/popup.html'
    }),
    new CopyWebpackPlugin([
      { from: './app/meta/manifest.json' },
      { from: './app/images', to: 'images' } // filter this thing later
    ])
  ]
};
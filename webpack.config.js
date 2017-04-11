const path = require('path');
const webpack = require('webpack');
const loadenv = require('node-env-file');

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'inline-source-map',
  devtool: 'source-map',
  entry: {
    runtime: ['./lib/Runtime'],
    preview: ['./lib/Preview'],
    detail: ['./lib/Detail'],
    editor: ['./lib/Editor'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
    library: 'SurveyDesigner',
    libraryTarget: 'var',
  },
  plugins: [
    // 環境変数の読み込み
    new webpack.DefinePlugin({ ENV: (() => JSON.stringify(loadenv('./.env')))() }),
    // new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  externals: [
    { tinymce: true },
  ],
  module: {
    noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.js')],
    /*
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    */
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]',
      },
      {
        test: require.resolve('numbro'),
        loader: 'expose-loader?numbro',
      },
      {
        test: require.resolve('moment'),
        loader: 'expose-loader?moment',
      },
      {
        test: require.resolve('pikaday'),
        loader: 'expose-loader?Pikaday',
      },
      {
        test: require.resolve('zeroclipboard'),
        loader: 'expose-loader?ZeroClipboard',
      },
    ],
    resolve: {
      alias: {
        handsontable: path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js'),
        'handsontable.css': path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.css'),
      },
    },
  },
  eslint: {
    configFile: '.eslintrc.json',
    fix: true,
  },
};

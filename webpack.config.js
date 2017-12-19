const path = require('path');
const webpack = require('webpack');
const loadenv = require('node-env-file');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const plugins = [
  // 環境変数の読み込み
  new webpack.DefinePlugin({
    ENV: (() => JSON.stringify(loadenv('./.env')))(),
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name].css').replace('css/js', 'css');
    },
    allChunks: true
  }),
];
// プロダクション環境のみuglifyする
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true }));
}

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'inline-source-map',
  devtool: 'source-map',
  entry: {
    runtime: ['./lib/Runtime'],
    preview: ['./lib/Preview'],
    detail: ['./lib/Detail'],
    editor: ['./lib/Editor'],
    image: ['./lib/Image'],
  },
  output: {
    path: path.join(__dirname, 'docs/survey-designer-js'),
    filename: '[name].bundle.js',
    publicPath: '/survey-desinger-js/',
    library: 'SurveyDesigner',
    libraryTarget: 'var',
  },
  plugins,
  externals: [
    { tinymce: true },
  ],
  devServer: {
    contentBase: [path.join(__dirname, 'docs'), __dirname],
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    setup: (app) => {
      app.post('/images/save', (req, res) => res.redirect('/images/save.json'));
      app.post('/images/delete', (req, res) => res.redirect('/images/delete.json'));
    },
  },
  module: {
    noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.js')],
    rules: [
      { test: /webpack-dev-server.client/, loader: 'null-loader' }, // auto reloadを無効にするための設定
      {
        test: /\.scss$/,
        use: ExtractTextPlugin
          .extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', query: { sourceMap: true, minimize: false } },
              { loader: 'sass-loader', query: { sourceMaps: true } },
            ],
          }),
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: __dirname,
        use: [
          { loader: 'babel-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin
          .extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', query: { sourceMap: true, minimize: false } },
            ],
          }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin
          .extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', query: { sourceMap: true, minimize: false } },
              { loader: 'less-loader' },
            ],
          }),
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 30000, name: '[name]-[hash].[ext]' },
          },
        ],
      },
      {
        test: require.resolve('numbro'),
        use: [{ loader: 'expose-loader?numbro' }],
      },
      {
        test: require.resolve('moment'),
        use: [{ loader: 'expose-loader?moment' }],
      },
      {
        test: require.resolve('pikaday'),
        use: [{ loader: 'expose-loader?Pikaday' }],
      },
      {
        test: require.resolve('zeroclipboard'),
        use: [{ loader: 'expose-loader?ZeroClipboard' }],
      },
      {
        test: require.resolve('underscore'),
        use: [{ loader: 'expose-loader?_' }],
      },
    ],
    /*
    resolve: {
      alias: {
        handsontable: path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js'),
        'handsontable.css': path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.css'),
      },
    },
    */
  },
  /*
  eslint: {
    configFile: '.eslintrc.json',
    fix: true,
  },
  */
};

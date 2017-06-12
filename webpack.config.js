const path = require('path');
const webpack = require('webpack');
const loadenv = require('node-env-file');

const plugins = [
  // 環境変数の読み込み
  new webpack.DefinePlugin({
    ENV: (() => JSON.stringify(loadenv('./.env')))(),
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
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
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
    library: 'SurveyDesigner',
    libraryTarget: 'var',
  },
  plugins,
  externals: [
    { tinymce: true },
  ],
  devServer: {
    contentBase: [path.join(__dirname, 'www'), __dirname],
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
  },
  module: {
    noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.js')],
    rules: [
      { test: /webpack-dev-server.client/, loader: 'null-loader' }, // auto reloadを無効にするための設定
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
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
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

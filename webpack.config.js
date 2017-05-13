const path = require('path');
const webpack = require('webpack');
const loadenv = require('node-env-file');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const defaultCss  = new ExtractTextPlugin('[name].css');

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
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = [{
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
    publicPath: '/js/',
    library: 'SurveyDesigner',
    libraryTarget: 'var',
  },
  plugins,
  externals: [
    { tinymce: true },
  ],
  module: {
    noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.js')],
    rules: [
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
        exclude: /default.scss$/,
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
  },
},
{
  entry: {
    default: ['./lib/runtime/css/default.scss'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].css',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: defaultCss.extract(['css-loader', 'sass-loader']),
      },
    ],
  },
  plugins: [
    defaultCss,
  ],
}];

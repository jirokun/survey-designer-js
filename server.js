const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const express = require('express');
const app = new (express)();
const port = 3000;

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config[0].output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use('/', express.static('docs'));
app.use('/js/jquery.min.js', express.static('/node_modules/jquery/dist/jquery.min.js'));
app.use('/js/tinymce.min.js', express.static('/node_modules/tinymce/tinymce.min.js'));

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});

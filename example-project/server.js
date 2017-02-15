const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const express = require('express');

const app = new (express)();
const port = 3000;

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use('/', express.static('www'));
app.use('/node_modules/', express.static('node_modules'));
app.use('/bower_components/', express.static('bower_components'));
/*
app.get("/", function(req, res) {
  res.sendFile(__dirname + 'www/index.html')
})
app.get("/runtime", function(req, res) {
  res.sendFile(__dirname + 'www/runtime.html')
})
app.get("/editor", function(req, res) {
  res.sendFile(__dirname + 'www/editor.html')
})
*/

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});

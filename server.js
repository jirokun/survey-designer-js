var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var express = require('express');
var app = new (express)();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use('/', express.static('www'));
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

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
})

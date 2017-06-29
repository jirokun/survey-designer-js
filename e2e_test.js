const process = require('process');
const spawn = require('child_process').spawn;
const http = require('http');

let exitStatus = 0;
function startE2ETest(server) {
  const e2eTest = spawn('yarn', ['test:e2e'], { stdio: 'inherit', stdrr: 'inherit' });

  e2eTest.on('exit', (code) => {
    exitStatus = code;
    server.kill();
  });
}

function startCheck(server) {
  const req = http.request({
    host: 'localhost',
    port: 3000,
    path: '/static/editor.bundle.js',
  }, (res) => {
    let startTestFlag = false;
    res.on('data', () => {
      if (startTestFlag) return;
      startTestFlag = true;
      startE2ETest(server);
    });
  });

  req.on('error', () => setTimeout(startCheck.bind(null, server), 1000));
  req.end();
}

const server = spawn('./node_modules/.bin/webpack-dev-server', { stdio: 'inherit', stdrr: 'inherit' });

server.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code);
  } else {
    process.exit(exitStatus);
  }
});

startCheck(server);

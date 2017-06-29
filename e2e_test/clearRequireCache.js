const fs = require('fs');
const path = require('path');

function walk(p, fileCallback, errCallback) {
  fs.readdir(p, (err, files) => {
    if (err) {
      errCallback(err);
      return;
    }

    files.forEach((f) => {
      const fp = path.join(p, f); // to full-path
      if (fp.indexOf('node_modules') !== -1) return;
      if (fs.statSync(fp).isDirectory()) {
        walk(fp, fileCallback); // ディレクトリなら再帰
      } else {
        fileCallback(path.resolve(fp)); // ファイルならコールバックで通知
      }
    });
  });
}

function clearRequireCache() {
  walk(
    '.',
    (filePath) => {
      try {
        if (require.cache[filePath]) {
          // console.log("clear require cache " + filePath);
          delete require.cache[filePath];
        }
      } catch (e) {
        // do nothing
      }
    },
    (err) => {
      console.error(err);
    }
  );
}

//clearRequireCache();
module.exports = clearRequireCache;


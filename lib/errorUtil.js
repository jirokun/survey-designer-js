/* eslint-env browser,jquery */

/*
 * Javascript でのエラーを検知し、記録する機能を提供します。
 */
function createHttpRequest() {
  if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
  return null;
}

function encodeHTMLForm(data) {
  const params = [];
  for (const name in data) {
    if (!Object.prototype.hasOwnProperty.call(data, name)) continue;
    const value = data[name];
    const param = `${encodeURIComponent(name).replace(/%20/g, '+')}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
    params.push(param);
  }
  return params.join('&');
}

function sendError(apiUrl, data) {
  const httpobj = createHttpRequest();
  if (httpobj) {
    httpobj.open('POST', apiUrl, true);
    httpobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpobj.send(encodeHTMLForm(data));
  }
}

function getData(errorMessage, errorFile, errorLine, errorCol, error) {
  const data = {
    title: errorMessage,
    errorMessage,
    errorFile: `${errorFile} (L.${errorLine})`,
    errorCol,
    stack: error ? error.stack : null,
    url: location.href,
  };
  return data;
}

function decideErrorLevel(errorFile) {
  try {
    // テスト環境は全てエラー扱い
    if (location.hostname.search(/\./) === -1) {
      return 'error';
    }
    return (errorFile.match(/^http[^?]+m3\.com/) != null) ? 'error' : 'warn';
  } catch (e) {
    return 'Unknown';
  }
}

export default function makeErrorHandler(apiUrl) {
  return (errorMessage, errorFile, errorLine, errorCol, error) => {
    try {
      const errorLevel = decideErrorLevel(errorFile);
      if (errorLevel !== 'error') return;
      sendError(apiUrl, getData(errorMessage, errorFile, errorLine, errorCol, error));
    } catch (e) {
      // Do nothing
    }
  };
}

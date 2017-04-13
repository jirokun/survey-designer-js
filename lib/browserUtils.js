import browser from 'detect-browser';

export function isIELowerEquals(version) {
  return browser.name === 'ie' && parseInt(browser.version.substr(0, browser.version.indexOf('.')), 10) <= version;
}

import browser from 'detect-browser';
import { parseInteger } from './utils';

export function isIELowerEquals(version) {
  // browserが定義されていないときは未知のブラウザ
  if (!browser) return false;
  return browser.name === 'ie' && parseInteger(browser.version.substr(0, browser.version.indexOf('.'))) <= version;
}

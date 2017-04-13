import browser from 'detect-browser';
import { parseInteger } from './utils';

export function isIELowerEquals(version) {
  return browser.name === 'ie' && parseInteger(browser.version.substr(0, browser.version.indexOf('.'))) <= version;
}

/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import $ from 'jquery';
import _ from 'underscore';
require('parsleyjs');

Enzyme.configure({ adapter: new Adapter() });
const { JSDOM } = require('jsdom');
/* eslint-enable */

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.$ = $;
global._ = _;
copyProps(window, global);

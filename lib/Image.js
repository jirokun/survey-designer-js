/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import Raven from 'raven-js';
import React from 'react';
import { render } from 'react-dom';
import ImageManagerApp from './editor/containers/ImageManagerApp';
import { RequiredBrowserNoticeForRuntime } from './browserRequirements';
import { isIELowerEquals } from './browserUtils';

export function Image(el, options) {
  if (isIELowerEquals(10)) {
    render(<RequiredBrowserNoticeForRuntime />, el);
    return null;
  }

  render(
    <ImageManagerApp options={options} />,
    el,
  );
}

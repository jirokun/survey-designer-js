/* eslint-env browser,jquery */
import React from 'react';

export function RequiredBrowserNoticeForEditor() {
  return (
    <div>
      <p>
      ご利用の環境ではこのページを表示することができません。<br />
      以下のいずれかのブラウザをご利用ください。</p>
      <ul>
        <li>Google Chrome 最新版</li>
        <li>Firefox 最新版</li>
        <li>Microsoft Edge</li>
        <li>Microsoft Internet Explorer 11</li>
      </ul>
    </div>
  );
}

export function RequiredBrowserNoticeForRuntime() {
  return (
    <div>
      <p>
      ご利用の環境ではこのページを表示することができません。<br />
      以下のいずれかのブラウザをご利用ください。</p>
      <ul>
        <li>Google Chrome 最新版</li>
        <li>Firefox 最新版</li>
        <li>Microsoft Edge</li>
        <li>Microsoft Internet Explorer 9以上</li>
      </ul>
    </div>
  );
}

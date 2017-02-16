/* eslint-env browser */
import React, { Component } from 'react';
import EnqueteRuntimeApp from './EnqueteRuntimeApp';
import css from '../css/runtime.scss';

export default class EnquetePreviewApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'pc',
    };
  }

  changeView(mode) {
    this.setState({ mode });
  }

  render() {
    const { restart } = this.props;
    const { mode } = this.state;

    if (mode === 'pc') {
      document.body.className = 'm3-enquete__user-agent-group--PC';
    } else {
      document.body.className = 'm3-enquete__user-agent-group--SP';
    }

    return (
      <div>
        <div className="formButtons preview">
          <p>[プレビュー モード] 回答は保存されません</p>
          <button onClick={() => restart()}>やり直す</button>
          <button onClick={() => window.close()}>閉じる</button>
          <button className="spMode pc" style={{ marginLeft: '50px' }} onClick={() => this.changeView('pc')}>PC表示</button>
          <button className="spMode sp" onClick={() => this.changeView('sp')}>スマホ表示</button>
        </div>
        <EnqueteRuntimeApp noPostAnswer />
      </div>
    );
  }
}

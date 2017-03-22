/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import EnqueteRuntimeApp from './EnqueteRuntimeApp';
import * as Actions from '../actions';

/** プレビューのためのコンテナ */
class EnquetePreviewApp extends Component {
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

    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/).map(url => <link key={url} type="text/css" rel="stylesheet" href={url} />);

    return (
      <div>
        {cssLinks}
        <div className="formButtons preview">
          <p>[プレビュー モード] 回答は保存されません</p>
          <button onClick={() => restart()}>やり直す</button>
          <button onClick={() => window.close()}>閉じる</button>
          <button className="spMode pc" style={{ marginLeft: '50px' }} onClick={() => this.changeView('pc')}>PC表示</button>
          <button className="spMode sp" onClick={() => this.changeView('sp')}>スマホ表示</button>
        </div>
        <EnqueteRuntimeApp noPostAnswer showEditModeMessage />
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  restart: () => dispatch(Actions.restart()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnquetePreviewApp);

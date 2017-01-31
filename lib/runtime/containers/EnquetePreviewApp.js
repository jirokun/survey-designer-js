/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import EnqueteRuntimeApp from './EnqueteRuntimeApp';
import * as Actions from '../actions';

class EnquetePreviewApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'PC',
    };
  }

  changeView(mode) {
    this.setState({ mode });
  }

  render() {
    const { state, restart } = this.props;
    const { mode } = this.state;
    const currentPage = state.findCurrentPage();
    if (!currentPage) {
      return <div>undefined page</div>;
    }

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
        <EnqueteRuntimeApp />
      </div>
    );
  }
}

EnquetePreviewApp.propTypes = {
};

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

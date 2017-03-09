import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import Finisher from '../components/Finisher';

/** アンケートのランタイムコンテナ */
class EnqueteRuntimeApp extends Component {
  /** nodeを描画 */
  createNode() {
    const { state, noPostAnswer } = this.props;
    const currentNode = state.findCurrentNode();

    if (currentNode === null) {
      return <div>削除されたノードです</div>;
    } else if (currentNode.isPage()) {
      return <Page page={state.findCurrentPage()} />;
    } else if (currentNode.isBranch()) {
      return <div>分岐は表示できません</div>;
    } else if (currentNode.isFinisher()) {
      return <Finisher finisher={state.findCurrentFinisher()} noPostAnswer={noPostAnswer} />;
    }
    throw new Error(`不明なnodeTypeです。type: ${currentNode.getType()}`);
  }

  render() {
    const { state } = this.props;
    const survey = state.getSurvey();
    return (
      <div>
        <div id="content">
          <div id="surveyBox">
            <h1>{survey.getTitle()}</h1>
          </div>
          <div className="questionsEditBox">
            {this.createNode()}
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});

export default connect(
  stateToProps,
)(EnqueteRuntimeApp);

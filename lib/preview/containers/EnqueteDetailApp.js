/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../../runtime/components/Page';
import Finisher from '../../runtime/components/Finisher';
import BranchEditor from '../../editor/components/editors/BranchEditor';
import * as Actions from '../../runtime/actions';

/** プレビューのためのコンテナ */
class EnqueteDetailApp extends Component {
  /** nodeを描画 */
  createNode(node) {
    const { survey } = this.props;

    if (node === null) {
      return <div>削除されたノードです</div>;
    } else if (node.isPage()) {
      const page = survey.findPageFromNode(node.getId());
      return (
        <div>
          <div className="page-no">ページ {survey.calcPageNo(page.getId())}</div>
          <Page key={node.getId()} page={page} noTransition showEditModeMessage />
        </div>
      );
    } else if (node.isBranch()) {
      const branch = survey.findBranchFromNode(node.getId());
      return (
        <div key={node.getId()}>
          <div className="branch-no">分岐 {survey.calcBranchNo(branch.getId())}</div>
          分岐は表示できません
        </div>
      );
    } else if (node.isFinisher()) {
      const finisher = survey.findFinisherFromNode(node.getId());
      return (
        <div>
          <div className="finisher-no">終了 {survey.calcFinisherNo(finisher.getId())} {finisher.isComplete() ? 'COMPLETE' : 'SCREEN'}</div>
          <Finisher
            key={node.getId()}
            finisher={finisher}
            noPostAnswer
          />
        </div>
      );
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }

  render() {
    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/).map(url => <link key={url} type="text/css" rel="stylesheet" href={url} />);
    const { survey } = this.props;

    return (
      <div>
        {cssLinks}
        <div id="content">
          <div id="surveyBox">
            <h1>{survey.getTitle()}</h1>
          </div>
          <div>
            {survey.getNodes().map(node => (
              <div key={`${node.getId()}_container`} className="questionsEditBox">
                {this.createNode(node)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  restart: () => dispatch(Actions.restart()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteDetailApp);

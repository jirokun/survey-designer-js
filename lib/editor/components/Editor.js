/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as EditorActions from '../actions';
import PageEditor from './editors/PageEditor';
import BranchEditor from './editors/BranchEditor';
import FinisherEditor from './editors/FinisherEditor';

/** エディタの領域を描画する */
class Editor extends Component {
  /** currentNodeの種類に対応するeditorを作成する */
  createEditor() {
    const { runtime, survey } = this.props;
    const node = runtime.findCurrentNode(survey);
    if (node === null) {
      return <div>削除されたノードです</div>;
    } else if (node.isPage()) {
      const page = runtime.findCurrentPage(survey);
      return <PageEditor node={node} page={page} />;
    } else if (node.isBranch()) {
      const branch = runtime.findCurrentBranch(survey);
      return <BranchEditor node={node} branch={branch} />;
    } else if (node.isFinisher()) {
      const finisher = runtime.findCurrentFinisher(survey);
      return <FinisherEditor node={node} finisher={finisher} />;
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }

  render() {
    return <div className="editor-pane">{this.createEditor()}</div>;
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Editor);

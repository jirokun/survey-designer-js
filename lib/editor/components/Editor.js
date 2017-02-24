/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as EditorActions from '../actions';
import QuestionEditor from './editors/QuestionEditor';
import BranchEditor from './editors/BranchEditor';
import FinisherEditor from './editors/FinisherEditor';
import { SURVEY_NOT_MODIFIED, SURVEY_POSTED_SUCCESS } from '../../constants/states';


/** エディタの領域を描画する */
class Editor extends Component {
  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    // 保存がされていない場合に遷移をしようとした場合は警告を出す
    window.addEventListener('beforeunload', (e) => {
      const { state } = this.props;
      const saveSurveyStatus = state.getViewSetting().getSaveSurveyStatus();
      if (saveSurveyStatus === SURVEY_NOT_MODIFIED || saveSurveyStatus === SURVEY_POSTED_SUCCESS) return null;
      const message = '修正が保存されていませんがこのページから遷移しますか？';
      e.returnValue = message;
      return message;
    }, false);
  }

  /** currentNodeの種類に対応するeditorを取得する */
  getEditor() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    if (node.isPage()) {
      const page = state.findCurrentPage();
      const questionEditors = page.questions.map(question => <div className="question-editor" key={`${page.getId()}_${question.getId()}`}><QuestionEditor question={question} page={page} /></div>);
      return questionEditors;
    } else if (node.isBranch()) {
      const branch = state.findCurrentBranch();
      return <BranchEditor branch={branch} />;
    } else if (node.isFinisher()) {
      const finisher = state.findCurrentFinisher();
      return <FinisherEditor finisher={finisher} />;
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }

  render() {
    return <div className="editor-pane">{this.getEditor()}</div>;
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Editor);

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import QuestionEditor from './QuestionEditor';
import JavaScriptEditor from './JavaScriptEditor';
import LogicalVariableEditor from './LogicalVariableEditor';
import * as Actions from '../../actions';
import * as EditorConstants from '../../../constants/editor';

/** エディタの領域を描画する */
class PageEditor extends Component {
  /** currentNodeの種類に対応するeditorを取得する */
  getQuestionEditors() {
    const { page } = this.props;
    const questionEditors = page.getQuestions().map(question => <div className="question-editor" key={`${page.getId()}_${question.getId()}`}><QuestionEditor question={question} page={page} /></div>);
    return <div id="question-editor-tab">{questionEditors}</div>;
  }

  handleSelect(key) {
    const { changePageEditorTab } = this.props;
    changePageEditorTab(key);
  }

  render() {
    const { page, view } = this.props;

    const activeKey = view.getSelectedPageEditorTab();

    return (
      <div className="editor-pane">
        <Tabs className="enq-tabs" id="PageEditor-tabs" activeKey={activeKey} animation={false} onSelect={key => this.handleSelect(key)}>
          <Tab eventKey={EditorConstants.TAB_QUESTIONS} title="設問定義">{this.getQuestionEditors()}</Tab>
          <Tab eventKey={EditorConstants.TAB_LOGICAL_VARIABLES} title="ロジック変数定義"><LogicalVariableEditor visible={activeKey === EditorConstants.TAB_LOGICAL_VARIABLES} page={page} /></Tab>
          <Tab eventKey={EditorConstants.TAB_JAVASCRIPT} title="JavaScript定義"><JavaScriptEditor visible={activeKey === EditorConstants.TAB_JAVASCRIPT} page={page} /></Tab>
        </Tabs>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});
const actionsToProps = dispatch => ({
  changePageEditorTab: eventKey => dispatch(Actions.changePageEditorTab(eventKey)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageEditor);


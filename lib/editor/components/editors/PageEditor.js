/* eslint-env browser */
import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import QuestionEditor from './QuestionEditor';
import JavaScriptEditor from './JavaScriptEditor';

/** エディタの領域を描画する */
export default class PageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 1,
    };
  }

  /** currentNodeの種類に対応するeditorを取得する */
  getQuestionEditors() {
    const { page } = this.props;
    const questionEditors = page.getQuestions().map(question => <div className="question-editor" key={`${page.getId()}_${question.getId()}`}><QuestionEditor question={question} page={page} /></div>);
    return questionEditors;
  }

  handleSelect(key) {
    this.setState({ selectedTab: key });
  }

  render() {
    const { page } = this.props;

    return (
      <div className="editor-pane">
        <Tabs id="PageEditor-tabs" activeKey={this.state.selectedTab} animation={false} onSelect={key => this.handleSelect(key)}>
          <Tab eventKey={1} title="設問定義">{this.getQuestionEditors()}</Tab>
          <Tab eventKey={2} title="JavaScript設定"><JavaScriptEditor visible={this.state.selectedTab === 2} page={page} /></Tab>
        </Tabs>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findQuestionEditorClass } from '../question_editors/QuestionEditors';

/**
 * 各Questionのエディタをレンダリングするラッパー。
 * questionのdataTypeに応じたエディタが描画される
 */
class QuestionEditor extends Component {
  /** questionのdataTypeに応じたエディタを取得する */
  findEditorComponent(name) {
    const { page, question } = this.props;
    const Editor = findQuestionEditorClass(name);
    if (!Editor) return <div>undefined component type: {name}</div>;
    return <Editor page={page} question={question} />;
  }

  /** 描画 */
  render() {
    const { question } = this.props;
    return (
      <div className="form-horizontal">
        {this.findEditorComponent(question.getDataType())}
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});

export default connect(
  stateToProps,
)(QuestionEditor);

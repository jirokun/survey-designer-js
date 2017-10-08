/* eslint-env browser */
import React, { Component } from 'react';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：単一選択肢(select) */
export default class SelectQuestion extends Component {
  createItem(item) {
    return <option key={`${item.getId()}-select-option`} value={item.getIndex() + 1}>{item.getPlainLabel()}</option>;
  }

  render() {
    const { survey, replacer, question, options } = this.props;
    const name = question.getOutputName();

    return (
      <div className="SelectQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <select
            name={name}
            id={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
          >
            <option value="" />
            {question.getItems().map(item => this.createItem(item))}
          </select>
        </div>
        { options.isShowDetail() ? <QuestionDetail {...this.props} /> : null }
      </div>
    );
  }
}

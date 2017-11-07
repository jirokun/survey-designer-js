/* eslint-env browser */
import React, { Component } from 'react';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：複数行テキスト */
export default class TextQuestion extends Component {
  render() {
    const { survey, options, replacer, question } = this.props;
    const name = question.getOutputName();

    return (
      <div className="TextQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <textarea
            name={name}
            id={name}
            className="freetext"
            rows="6"
            cols="40"
            data-output-no={survey.findOutputNoFromName(name)}
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
          />
        </div>
        { options.isShowDetail() ? <QuestionDetail optional {...this.props} /> : null }
      </div>
    );
  }
}

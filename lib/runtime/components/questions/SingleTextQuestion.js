/* eslint-env browser */
import React, { Component } from 'react';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：1行テキスト */
export default class SingleTextQuestion extends Component {
  render() {
    const { survey, options, replacer, question } = this.props;
    const name = question.getOutputName();

    return (
      <div className="SingleTextQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <input
            type="text"
            name={name}
            id={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
            data-parsley-maxlength="20"
          />
          <p>※20文字まで</p>
        </div>
        { options.isShowDetail() ? <QuestionDetail optional {...this.props} /> : null }
      </div>
    );
  }
}

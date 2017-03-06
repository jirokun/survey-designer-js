/* eslint-env browser */
import React, { Component } from 'react';

/** 設問：複数行テキスト */
export default class TextQuestion extends Component {
  render() {
    const { replaceUtil, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    const name = question.getOutputName();

    return (
      <div className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(description, answers) }} />
        <div className="question">
          <textarea
            name={name}
            id={name}
            rows="6"
            cols="40"
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
          />
        </div>
      </div>
    );
  }
}

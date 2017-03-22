/* eslint-env browser */
import React, { Component } from 'react';

/** 設問：1行テキスト */
export default class SingleTextQuestion extends Component {
  render() {
    const { replacer, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const name = question.getOutputName();

    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replacer.name2Value(title) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.name2Value(description) }} />
        <div className="question">
          <input
            type="text"
            name={name}
            id={name}
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
            data-parsley-maxlength="20"
          />
          <p>※20文字まで</p>
        </div>
      </div>
    );
  }
}

/* eslint-env browser */
import React, { Component } from 'react';
import { r } from '../../../utils';

/** 設問：複数行テキスト */
export default class TextQuestion extends Component {
  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    const id = question.getId();
    return (
      <div className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: r(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />
        <div className="question">
          <textarea
            name={id}
            id={id}
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

/* eslint-env browser */
import React, { Component } from 'react';
import { r } from '../../../utils';

export default class SingleTextQuestion extends Component {
  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    const id = question.getId();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: r(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />
        <div className="question">
          <input
            type="text"
            name={id}
            id={id}
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

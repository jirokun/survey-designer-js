/* eslint-env browser */
import React, { Component } from 'react';
import * as Utils from '../../../utils';

export default class SingleTextQuestion extends Component {
  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const inputValues = {};
    const id = question.getId();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(description, inputValues) }} />
        <div className="question">
          <input type="text" name={id} id={id} data-parsley-required data-parsley-maxlength="20" />
          <p>※20文字まで</p>
        </div>
      </div>
    );
  }
}

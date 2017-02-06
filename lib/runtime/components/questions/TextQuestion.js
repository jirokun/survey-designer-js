/* eslint-env browser */
import React, { Component } from 'react';
import * as Utils from '../../../utils';

export default class TextQuestion extends Component {
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
          <textarea name={id} id={id} rows="6" cols="40" data-parsley-required />
        </div>
      </div>
    );
  }
}

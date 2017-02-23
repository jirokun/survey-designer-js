/* eslint-env browser */
import React, { Component } from 'react';
import { r } from '../../../utils';

export default class DescriptionQuestion extends Component {
  render() {
    const { question } = this.props;
    const description = question.getDescription();
    const answers = {};
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <p className="description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />
      </div>
    );
  }
}

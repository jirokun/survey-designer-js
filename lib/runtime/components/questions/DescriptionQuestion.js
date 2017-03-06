/* eslint-env browser */
import React, { Component } from 'react';

/** 設問：説明文 */
export default class DescriptionQuestion extends Component {
  render() {
    const { replaceUtil, question } = this.props;
    const description = question.getDescription();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <p className="description" dangerouslySetInnerHTML={{ __html: replaceUtil.name2Value(description) }} />
      </div>
    );
  }
}

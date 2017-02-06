import React, { Component } from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default class MultiNumberQuestionEditor extends Component {
  render() {
    const { page, question } = this.props;

    return (
      <BaseQuestionEditor
        page={page}
        question={question}
        title
        description
        random
        showTotal
        item
        min
        max
        unit
        totalEqualTo
      />
    );
  }
}

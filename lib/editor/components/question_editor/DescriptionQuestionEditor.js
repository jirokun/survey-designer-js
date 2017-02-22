import React, { Component } from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default class DescriptionQuestionEditor extends Component {
  render() {
    const { page, question } = this.props;

    return (
      <BaseQuestionEditor
        page={page}
        question={question}
        description="説明文"
      />
    );
  }
}

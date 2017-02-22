import React, { Component } from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default class ScreeningAgreementQuestionEditor extends Component {
  render() {
    const { page, question } = this.props;

    return (
      <BaseQuestionEditor
        page={page}
        question={question}
        noEdit
      />
    );
  }
}

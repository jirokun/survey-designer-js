import React, { Component } from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default class ScheduleQuestionEditor extends Component {
  render() {
    const { page, question } = this.props;

    return (
      <BaseQuestionEditor
        page={page}
        question={question}
        item="日程"
        itemPlainText
      />
    );
  }
}

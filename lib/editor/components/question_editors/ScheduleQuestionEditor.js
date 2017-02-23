import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function ScheduleQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      item="日程"
      itemPlainText
    />
  );
}

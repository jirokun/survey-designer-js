import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function MultiNumberQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="数値記入"
      title
      description
      random
      showTotal
      item="項目名"
      min
      max
      unit
      totalEqualTo
    />
  );
}

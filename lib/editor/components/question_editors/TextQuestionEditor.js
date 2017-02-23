import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function TextQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      title
      description
    />
  );
}

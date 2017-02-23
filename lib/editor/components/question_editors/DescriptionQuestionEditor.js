import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function DescriptionQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      description="説明文"
    />
  );
}

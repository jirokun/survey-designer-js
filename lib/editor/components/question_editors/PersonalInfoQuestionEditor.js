import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function PersonalInfoQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="個人情報"
      item
      title
      description
      hideDisplayControl
    />
  );
}

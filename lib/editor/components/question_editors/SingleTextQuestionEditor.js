import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function SingleTextQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="1行テキスト"
      title
      description
      optional
    />
  );
}

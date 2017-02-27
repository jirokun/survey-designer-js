import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function ScreeningAgreementQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="調査許諾"
      noEdit
    />
  );
}

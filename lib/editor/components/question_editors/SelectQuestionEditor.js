import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function SelectQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="単一選択肢(プルダウン)"
      title
      description
      item
      itemPlainText
    />
  );
}

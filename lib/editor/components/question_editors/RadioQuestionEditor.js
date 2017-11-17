import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function RadioQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="単一選択肢(ラジオボタン)"
      title
      description
      random
      optional
      item
      itemAdditionalInput
    />
  );
}

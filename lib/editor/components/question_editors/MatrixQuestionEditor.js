import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function MatrixQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="単一選択肢"
      title
      description
      matrixType
      random="行項目をランダム表示"
      subItemsRandom="列項目をランダム表示"
      item="行項目"
      subItem="列項目"
    />
  );
}

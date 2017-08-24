import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function MatrixQuestionEditor(props) {
  const { page, question } = props;

  const itemExclusive = question.getMatrixType() === 'checkbox' && question.isMatrixReverse();
  const subItemExclusive = question.getMatrixType() === 'checkbox' && !question.isMatrixReverse();
  const matrixSum = question.getMatrixType() === 'number';
  const matrixReverse = question.isMatrixReverse();
  const itemAdditionalInput = matrixReverse && (question.getMatrixType() === 'checkbox' || question.getMatrixType() === 'radio');
  const subItemAdditionalInput = !matrixReverse && (question.getMatrixType() === 'checkbox' || question.getMatrixType() === 'radio');
  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="表形式"
      title
      description
      matrixType
      matrixReverse
      matrixSumRows={matrixSum}
      matrixSumCols={matrixSum}
      random="行項目をランダム表示"
      subItemsRandom="列項目をランダム表示"
      item="行項目"
      subItem="列項目"
      itemExclusive={itemExclusive}
      subItemExclusive={subItemExclusive}
      itemAdditionalInput={itemAdditionalInput}
      subItemAdditionalInput={subItemAdditionalInput}
      matrixTategakiCols
    />
  );
}

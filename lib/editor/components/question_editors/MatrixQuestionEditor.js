import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function MatrixQuestionEditor(props) {
  const { page, question } = props;

  const isTypeCheckbox = question.getMatrixType() === 'checkbox';
  const itemExclusive = isTypeCheckbox && question.isMatrixReverse();
  const subItemExclusive = isTypeCheckbox && !question.isMatrixReverse();
  const matrixSum = question.getMatrixType() === 'number';
  /*
  その他記入はadditionalInputを再利用する形で実装するため、コメントアウトして残している。
  その他記入実装時に綺麗にすること
  const itemAdditionalInput = matrixReverse && (question.getMatrixType() === 'checkbox' || question.getMatrixType() === 'radio');
  const subItemAdditionalInput = !matrixReverse && (question.getMatrixType() === 'checkbox' || question.getMatrixType() === 'radio');
  */
  const matrixReverse = question.isMatrixReverse();
  const createsUnitLabel = question.getMatrixType() === 'number';
  const createsSubUnitLabel = question.getMatrixType() === 'number';
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
      createsUnitLabel={createsUnitLabel}
      createsSubUnitLabel={createsSubUnitLabel}
      matrixColVerticalWriting
      itemAdditionalInput
      subItemAdditionalInput
      optionalItem={!isTypeCheckbox && !matrixReverse}
      optionalSubItem={!isTypeCheckbox && matrixReverse}
      matrixHtmlEnabled
      checkCount={isTypeCheckbox}
      matrixRowAndColumnUnique
    />
  );
}

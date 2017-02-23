import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function CheckboxQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      title
      description
      random
      item
      itemAdditionalInput
      itemExclusive
      checkCount
    />
  );
}

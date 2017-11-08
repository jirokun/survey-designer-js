import React from 'react';
import BaseQuestionEditor from './BaseQuestionEditor';

export default function DescriptionQuestionEditor(props) {
  const { page, question } = props;

  return (
    <BaseQuestionEditor
      page={page}
      question={question}
      editorTitle="説明文 / 表紙など"
      description="内容"
    />
  );
}

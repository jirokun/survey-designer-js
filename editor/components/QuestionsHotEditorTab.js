import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class QuestionsHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ID', 'PageId', 'QuestionTitle', 'QuestionType'];
    const columns = [
      {data: 'id'},
      {data: 'pageId'},
      {data: 'questionTitle'},
      {data: 'questionType', editor: 'select', selectOptions: ['default']},
    ];
    const colWidths = [100, 70, 100, 100];
    super(props, 'questionDefs', colHeaders, columns, colWidths);
  }
  // TODO QuestionTypeのデフォルト値を設定する
}

import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class ItemsHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ID', 'QuestionId', 'ItemType', 'ItemTitle', 'ItemName'];
    const columns = [
      {data: 'id'},
      {data: 'questionId'},
      {data: 'itemType', editor: 'select', selectOptions: [
        'RadioItem',
        'CheckboxItem',
        'SelectItem',
        'TextItem']
      },
      {data: 'itemTitle'},
      {data: 'itemName'}
    ];
    const colWidths = [100, 100, 150, 400, 100];
    super(props, 'itemDefs', colHeaders, columns, colWidths);
  }
}

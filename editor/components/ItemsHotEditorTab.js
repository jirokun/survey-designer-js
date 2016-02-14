import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class ItemsHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ID', 'QuestionId', 'ItemType', 'ItemTitle', 'ItemName'];
    const columns = [
      {data: 'id'},
      {data: 'questionId'},
      {data: 'itemType', editor: 'select', selectOptions: [
        'H-Radio',
        'H-Checkbox',
        'V-Radio',
        'V-Checkbox',
        'Select',
        'Text']
      },
      {data: 'itemTitle'},
      {data: 'itemName'}
    ];
    const colWidths = [150, 150, 150, 400, 150];
    super(props, 'itemDefs', colHeaders, columns, colWidths);
  }
}

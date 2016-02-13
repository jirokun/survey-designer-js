import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class FlowsHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['FlowID', 'Type', 'PageId', 'NextFlowID'];
    const columns = [
      {data: 'id'},
      {data: 'type', editor: 'select', selectOptions: ['page', 'branch']},
      {data: 'pageId'},
      {data: 'nextFlowId'}
    ];
    const colWidths = [100, 70, 100, 100];
    super(props, 'flowDefs', colHeaders, columns, colWidths);
  }
  beforeChange(changes, source) {
    for (let i = 0, len = changes.length; i < len; i++) {
      const change = changes[i];
      const rowNum = change[0];
      const column = change[1];
      const newData = change[3];
      if (column === 'type' && (newData === '' || newData === null)) {
        change[3] = 'page';
        continue;
      }
      const rowData = this.hot.getDataAtRow(rowNum);
      const typeIndex = this.findColumnIndex('type');
      if (rowData[typeIndex] === null || rowData[typeIndex] === '') {
        changes.push([rowNum, 'type', null, 'page']);
      }
    }
  }
}

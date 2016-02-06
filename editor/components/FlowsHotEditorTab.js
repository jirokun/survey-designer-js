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
}

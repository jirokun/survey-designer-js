import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class ConditionsHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['FlowID', 'Type', 'Target Question', 'Operator', 'Value', 'NextFlowID'];
    const columns = [
      {data: 'flowId'},
      {data: 'type', editor: 'select', selectOptions: ['if', 'else']},
      {data: 'question'},
      {data: 'operator', editor: 'select', selectOptions: ['==', '!=', '<', '>', '<=', '>=']},
      {data: 'value'},
      {data: 'nextFlowId'}
    ];
    const colWidths = [150, 70, 150, 80, 150, 150];
    super(props, 'conditionDefs', colHeaders, columns, colWidths);
  }
}

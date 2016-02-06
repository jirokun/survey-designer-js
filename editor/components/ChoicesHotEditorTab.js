import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class ChoicesHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ItemID', 'Label', 'Value'];
    const columns = [
      {data: 'itemId'},
      {data: 'label'},
      {data: 'value'}
    ];
    const colWidths = [100, 400, 200];
    super(props, 'choiceDefs', colHeaders, columns, colWidths);
  }
}

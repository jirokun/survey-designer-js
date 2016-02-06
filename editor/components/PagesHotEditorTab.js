import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class PagesHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ID', 'PageTitle'];
    const columns = [
      {data: 'id'},
      {data: 'pageTitle'}
    ];
    const colWidth = [100, 400];
    super(props, 'pageDefs', colHeaders, columns, colWidth);
  }
}

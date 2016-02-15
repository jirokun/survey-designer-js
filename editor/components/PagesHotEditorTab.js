import React, { Component, PropTypes } from 'react'
import HotEditorTabBase from './HotEditorTabBase'

export default class PagesHotEditorTab extends HotEditorTabBase {
  constructor(props) {
    const colHeaders = ['ID', 'PageTitle', 'PageType', 'CustomPageID'];
    const columns = [
      {data: 'id'},
      {data: 'pageTitle'},
      {data: 'pageType', editor: 'select', selectOptions: ['default', 'custom']},
      {data: 'customPageId'},
    ];
    const colWidth = [150, 400, 150, 150];
    super(props, 'pageDefs', colHeaders, columns, colWidth);
  }
}

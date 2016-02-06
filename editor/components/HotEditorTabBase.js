import React, { Component, PropTypes } from 'react'
import { findFlow } from '../../utils'

export default class HotEditorTabBase extends Component {
  constructor(props, defsName, colHeaders, columns, colWidths) {
    super(props);
    this.defsName = defsName;
    this.colHeaders = colHeaders;
    this.columns = columns;
    this.colWidths = colWidths;
  }
  componentDidMount() {
    const data = this.props.state.defs[this.defsName];
    this.hot = new Handsontable(this.refs.hot, {
      colHeaders: this.colHeaders,
      columns: this.columns,
      colWidths: this.colWidths,
      contextMenu: {
        items: {
          row_above: {},
          row_below: {},
          hsep1: "---------",
          remove_row: {},
          hsep2: "---------",
          undo: {},
          redo: {}
        }
      },
      height: 400,
      minSpareRows: 1,
      data: data,
      afterChange: this.afterChange.bind(this)
    });
  }
  componentWillUnmount() {
    this.hot.destroy();
  }
  afterChange(changes, source) {
    if (source === 'loadData') return;
    const data = this.hot.getData();
    console.log(data);
    const retObj = data.map((row) => {
      var ret = {};
      row.forEach((val, i) => { ret[this.columns[i].data] = val});
      return ret;
    });
    this.props.onDefsChange(this.defsName, retObj);
  }

  render() {
    return (
      <div className="tab-pane active">
        <div ref="hot"></div>
      </div>
    )
  }
}

HotEditorTabBase.propTypes = {
  state: PropTypes.object.isRequired
}

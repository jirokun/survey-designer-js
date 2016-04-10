import React, { Component, PropTypes } from 'react'
import { cloneObj, findFlow } from '../../utils'
import { connect } from 'react-redux'

export default class HotEditorTabBase extends Component {
  constructor(props, defsName, colHeaders, columns, colWidths) {
    super(props);
    this.defsName = defsName;
    this.colHeaders = colHeaders;
    this.columns = columns;
    this.colWidths = colWidths;
    this.state = { updating: false };
  }
  componentDidMount() {
    const data = cloneObj(this.props.state.defs[this.defsName]);
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
      height: this.props.state.viewSettings.hotHeight,
      minSpareRows: 1,
      data: data,
      beforeChange: this.beforeChange.bind(this),
      afterChange: this.afterChange.bind(this),
      afterRemoveRow: this.afterRemoveRow.bind(this)
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.updating === true) {
      this.setState({ updating: false });
    } else {
      this.hot.loadData(cloneObj(nextProps.state.defs[this.defsName]));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const height = this.props.state.viewSettings.hotHeight;
    if (prevProps.state.viewSettings.hotHeight !== height) {
      const settings = this.hot.getSettings();
      settings.height = height;
      this.hot.updateSettings(settings);
    }
  }
  componentWillUnmount() {
    this.hot.destroy();
  }
  findColumnIndex(columnName) {
    const columns = this.hot.getSettings().columns;
    return columns.findIndex((col) => col.data === columnName);
  }
  beforeChange(changes, source) {
  }
  afterChange(changes, source) {
    if (source === 'loadData') return;
    this.props.onDefsChange(this.defsName, this.getDefs(), this.props.getPreviewWindow);
  }
  afterRemoveRow(index, amount) {
    if (this.hot.countRows() === index) return; // 最終行が削除された場合には何もしない
    this.props.onDefsChange(this.defsName, this.getDefs(), this.props.getPreviewWindow);
  }
  /** 現在hotで定義されているデータをdefsに変換する */
  getDefs() {
    const data = this.hot.getData();
    const defs = data.map((row) => {
      var ret = {};
      row.forEach((val, i) => { ret[this.columns[i].data] = val});
      return ret;
    });
    defs.splice(defs.length - 1, 1);
    return defs;
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

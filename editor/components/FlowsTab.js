import React, { Component, PropTypes } from 'react'
import { findFlow } from '../../utils'

export default class FlowsTab extends Component {
  componentDidMount() {
    const data = this.props.state.defs.flowDefs;
    this.hot = new Handsontable(this.refs.hot, {
      colHeaders: ['FlowID', 'Type', 'PageId', 'NextFlowID'],
      columns: [
        {data: 'id'},
        {data: 'type', editor: 'select', selectOptions: ['page', 'branch']},
        {data: 'pageId'},
        {data: 'nextFlowId'}
      ],
      colWidths: [100, 70, 100, 100],
      dataSchema: {id: null, type: null, pageId: null, nextFlowId: null},
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
      afterChange: this.afterChange.bind(this)
    });
    console.log(data);
    this.hot.loadData(data);
  }
  componentWillUnmount() {
    this.hot.destroy();
  }
  afterChange(changes, source) {
    console.log(changes, source);
    if (source === 'loadData') return;
    //var data = this.hot.getData();
    var data = this.hot.getDataAtRow(1);
    console.log(data);
    //this.props.defsChange(data);
  }

  render() {
    return (
      <div className="tab-pane active">
        <div ref="hot"></div>
      </div>
    )
  }
}

FlowsTab.propTypes = {
  state: PropTypes.object.isRequired
}

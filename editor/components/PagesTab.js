import React, { Component, PropTypes } from 'react'
import { findFlow } from '../../utils'

export default class PagesTab extends Component {
  componentDidMount() {
    const data = this.props.state.defs.pageDefs
    var hot = new Handsontable(this.refs.hot, {
      colHeaders: ['ID', 'PageTitle'],
      columns: [
        {data: 'id'},
        {data: 'pageTitle'}
      ],
      colWidths: [100, 400],
      data: data
    });
  }

  render() {
    return (
      <div className="tab-pane active">
        <div ref="hot"></div>
      </div>
    )
  }
}

PagesTab.propTypes = {
}

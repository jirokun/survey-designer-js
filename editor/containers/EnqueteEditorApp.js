import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export default class EnqueteEditorApp extends Component {
  componentDidMount() {
    var data = [
      ["", "Kia", "Nissan", "Toyota", "Honda"],
      ["2008", 10, 11, 12, 13],
      ["2009", 20, 11, 14, 13],
      ["2010", 30, 15, 12, 13]
    ];

    var hot = new Handsontable(this.refs.left, {
      data: data
    });
  }
  render() {
    return (
      <div>
        <div className="left" ref="left"></div>
        <div className="right">right</div>
      </div>
    )
  }
}

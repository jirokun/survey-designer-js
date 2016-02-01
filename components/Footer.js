import React, { Component, PropTypes } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <div>
      <input type="button" value="戻る" onClick={() => this.props.handleBack()}/>
      <input type="button" value="次へ" onClick={() => this.props.handleNext()}/>
      </div>
    )
  }
}

Footer.propTypes = {
}

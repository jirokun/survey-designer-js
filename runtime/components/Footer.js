import React, { Component, PropTypes } from 'react'
import { findFlow } from '../../utils'

export default class Footer extends Component {
  renderBack() {
    const { currentFlowId, flowStack, inputValues } = this.props.state.values;
    if (flowStack.length > 0) {
      return <input type="button" value="戻る" onClick={() => this.props.handleBack()}/>
    } else {
      return null;
    }
  }
  render() {
    const { currentFlowId, flowStack, inputValues } = this.props.state.values;
    return (
      <div>
      { this.renderBack() }
      <input type="button" value="次へ" onClick={() => this.props.handleNext()}/>
      </div>
    )
  }
}

Footer.propTypes = {
}

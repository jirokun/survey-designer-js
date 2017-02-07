import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { findNode } from '../../utils'
import { nextPage, prevPage } from '../actions'

export default class Footer extends Component {
  render() {
    const { nodeStack, prevPage, nextPage } = this.props;
    const backButtonStyle = { };
    if (nodeStack.length == 0) {
      backButtonStyle.visibility = 'hidden';
    }
    return (
      <div>
        <button style={backButtonStyle} onClick={prevPage}>戻る</button>
        <button onClick={nextPage}>進む</button>
      </div>
    )
  }
}

Footer.propTypes = {
}

const stateToProps = state => ({
  nodeStack: state.values.nodeStack,
});
const actionsToProps = dispatch => ({
  prevPage: () => dispatch(prevPage()),
  nextPage: () => dispatch(nextPage()),
});

export default connect(
  stateToProps,
  actionsToProps
)(Footer);

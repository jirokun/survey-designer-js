import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import { connect } from 'react-redux'
import { findFlow } from '../../utils'
import { nextPage, prevPage } from '../actions'

export default class Footer extends Component {
  render() {
    const { flowStack, prevPage, nextPage } = this.props;
    const backButtonStyle = { };
    if (flowStack.length == 0) {
      backButtonStyle.visibility = 'hidden';
    }
    return (
      <div>
        <RaisedButton label="戻る" secondary={true} style={backButtonStyle} onClick={prevPage}/>
        <RaisedButton label="次へ" primary={true} onClick={nextPage}/>
      </div>
    )
  }
}

Footer.propTypes = {
}

const stateToProps = state => ({
  flowStack: state.values.flowStack,
});
const actionsToProps = dispatch => ({
  prevPage: () => dispatch(prevPage()),
  nextPage: () => dispatch(nextPage()),
});

export default connect(
  stateToProps,
  actionsToProps
)(Footer);

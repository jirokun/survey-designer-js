/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import LogicalVariableForm from './LogicalVariableForm';
import * as EditorActions from '../../actions';

class LogicalVariableEditor extends Component {
  handleClickAddButton() {
    const { page, addLogicalVariable } = this.props;
    addLogicalVariable(page.getId());
  }

  render() {
    const { page } = this.props;
    const disabled = page.isEditDisabled();
    return (
      <div className="logic-variables">
        <p className="logic-variables-title">
            <Button disabled={disabled} className="add-logic-variable-button" bsStyle="primary" onClick={() => this.handleClickAddButton()}>変数追加</Button>
          </p>
        { page.getLogicalVariables().map(logicalVariable => <LogicalVariableForm key={logicalVariable.getId()} page={page} logicalVariable={logicalVariable} />) }
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  addLogicalVariable: pageId => dispatch(EditorActions.addLogicalVariable(pageId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(LogicalVariableEditor);

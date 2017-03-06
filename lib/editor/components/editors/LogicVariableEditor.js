/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import LogicVariableForm from './LogicVariableForm';
import * as EditorActions from '../../actions';

class LogicVariableEditor extends Component {
  handleClickAddButton() {
    const { page, addLogicVariable } = this.props;
    addLogicVariable(page.getId());
  }

  render() {
    const { page } = this.props;
    return (
      <div className="logic-variables">
        <Row>
          <Col md={12}>
            <Button className="add-logic-variable-button" bsStyle="primary" onClick={() => this.handleClickAddButton()}>変数追加</Button>
          </Col>
        </Row>
        { page.getLogicVariables().map(logicVariable => <LogicVariableForm key={logicVariable.getId()} page={page} logicVariable={logicVariable} />) }
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  addLogicVariable: pageId => dispatch(EditorActions.addLogicVariable(pageId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(LogicVariableEditor);

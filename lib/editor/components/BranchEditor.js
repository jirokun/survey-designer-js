import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import ConditionEditor from './ConditionEditor';
import * as EditorActions from '../actions';

class BranchEditor extends Component {
  handleChangeBranch(index, condition) {
    const { changeBranch, branch } = this.props;
    branch.conditions[index] = condition;
    changeBranch(branch.id, branch);
  }
  handleMoveCondition(sourceIndex, toIndex) {
    const { moveCondition, branch } = this.props;
    moveCondition(branch.id, sourceIndex, toIndex);
  }

  renderConditions() {
    const { state } = this.props;
    const branch = state.findCurrentBranch();
console.log(branch.get('conditions').size);
    return branch.get('conditions').map((condition, i) =>
      <ConditionEditor
        nextFlowId={condition.nextFlowId} key={condition.nextFlowId}
        condition={condition} index={i} isLast={branch.get('conditions').size === i + 1}
        handleChangeBranch={this.handleChangeBranch.bind(this)} handleMoveCondition={this.handleMoveCondition.bind(this)}/>
    );
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>分岐設定</ControlLabel>
              {this.renderConditions()}
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeBranch: (branchId, value) => dispatch(EditorActions.changeBranch(branchId, value)),
  moveCondition: (branchId, sourceIndex, toIndex) => dispatch(EditorActions.moveCondition(branchId, sourceIndex, toIndex)),

});

export default DragDropContext(HTML5Backend)(
  connect(
    stateToProps,
    actionsToProps,
  )(BranchEditor),
);

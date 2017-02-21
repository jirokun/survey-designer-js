import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Well, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import ConditionEditor from './ConditionEditor';
import * as EditorActions from '../actions';

class BranchEditor extends Component {
  handleSwapCondition(sourceIndex, toIndex) {
    const { swapCondition, branch } = this.props;
    swapCondition(branch.getId(), sourceIndex, toIndex);
  }

  renderConditions() {
    const { branch } = this.props;
    return branch.get('conditions').map((condition, i) =>
      <ConditionEditor
        key={`${this.constructor.name}-${condition.getId()}`}
        condition={condition}
        index={i}
        handleSwapCondition={(sourceIndex, toIndex) => this.handleSwapCondition(sourceIndex, toIndex)}
      />,
    );
  }

  render() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    const nextNodeId = node.getNextNodeId();
    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>分岐設定</ControlLabel>
              {this.renderConditions()}
              <Well className="branch-editor">
                <div className="branch-editor-header">
                  <span>上記以外の場合</span>
                  <span className="node-reference-label">{state.calcNodeLabel(nextNodeId)}</span>
                  <span>に遷移する</span>
                </div>
              </Well>
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
  swapCondition: (branchId, sourceIndex, toIndex) => dispatch(EditorActions.swapCondition(branchId, sourceIndex, toIndex)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchEditor);

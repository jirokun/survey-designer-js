import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class BranchInGraph extends Component {
  handleBranchSelect() {
    const { selectNode, node } = this.props;
    selectNode(node.getId());
  }

  handleAddCondition(index) {
    const { state, node, addCondition } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    addCondition(branch.getId(), index);
  }

  handleRemoveCondition(conditionId) {
    const { state, node, removeCondition } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    removeCondition(branch.getId(), conditionId);
  }

  handleRemoveBranch() {
    const { removeNode, node } = this.props;
    removeNode(node.getId());
  }

  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box">
        <div><i className="glyphicon glyphicon-plus-sign" onClick={() => this.handleAddCondition(index)} /></div>
      </li>
    );
  }

  render() {
    const { state, node } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    const conditions = branch.getConditions();
    const conditionEls = [];
    if (conditions.size === 0) {
      const sizeZeroKey = `${this.constructor.name}_${branch.getId()}__0}`;
      conditionEls.push(this.createInsertElement(`${sizeZeroKey}_insert_0`, 0));
    }
    conditions.forEach((condition, i) => {
      let pageLabel;
      try {
        const page = state.findPageFromNode(condition.getNextNodeId());
        pageLabel = state.calcPageLabel(page.getId());
      } catch (e) {
        pageLabel = '未設定';
      }
      const key = `${this.constructor.name}-${condition.getId()}`;

      if (i === 0) {
        conditionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      conditionEls.push(
        <li
          key={key}
          className="condition"
        >
          <Glyphicon
            className="text-danger delete-button"
            glyph="minus-sign"
            onClick={() => this.handleRemoveCondition(condition.getId())}
          />
          条件によって{pageLabel} に遷移
        </li>);
      conditionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });

    let elseLabel;
    try {
      const page = state.findPageFromNode(node.getNextNodeId());
      elseLabel = state.calcPageLabel(page.getId());
    } catch (e) {
      elseLabel = '未設定';
    }
    return (
      <div className="branch" onClick={() => this.handleBranchSelect()}>
        <Glyphicon className="text-danger delete-button" glyph="minus-sign" onClick={() => this.handleRemoveBranch()} />
        <span>分岐</span>
        <ul className="conditions">
          {conditionEls}
          <li className="condition">
            <Glyphicon
              className="text-danger delete-button"
              glyph="minus-sign"
              style={{ visibility: 'hidden' }}
            />
            上記条件以外は{elseLabel}に遷移</li>
        </ul>
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  addCondition: (branchId, index) => dispatch(Actions.addCondition(branchId, index)),
  removeCondition: (branchId, conditionId) => dispatch(Actions.removeCondition(branchId, conditionId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);

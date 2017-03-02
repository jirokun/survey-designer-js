import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConditionInGraph from './ConditionInGraph';
import * as Actions from '../../actions';
import NodeInGraph from './NodeInGraph';

/** Graphの中に描画する分岐 */
class BranchInGraph extends Component {
  /** conditionの追加を押したときの処理 */
  handleAddCondition(index) {
    const { state, node, addCondition } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    addCondition(branch.getId(), index);
  }

  /** conditionの追加ボタンを表示するためのliタグを作成する */
  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box">
        <div><i className="glyphicon glyphicon-plus-sign" onClick={() => this.handleAddCondition(index)} /></div>
      </li>
    );
  }

  /** 描画 */
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
      const key = `${this.constructor.name}-${condition.getId()}`;

      if (i === 0) {
        conditionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      conditionEls.push(<ConditionInGraph key={key} node={node} branch={branch} condition={condition} />);
      conditionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });

    const elseLabel = state.calcNodeLabel(node.getNextNodeId());
    return (
      <NodeInGraph node={node} nodeLabel="分岐" className="condition">
        <ul className="conditions">
          {conditionEls}
          <li className="condition">
            <i className="fa fa-bars drag-handler invisible" />
            &nbsp;
            上記条件以外は{elseLabel}に遷移</li>
        </ul>
      </NodeInGraph>
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
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);

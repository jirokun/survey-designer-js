import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConditionInFlow from './ConditionInFlow';
import * as Actions from '../../actions';
import NodeInFlow from './NodeInFlow';

/** Flowの中に描画する分岐 */
class BranchInFlow extends Component {
  /** conditionの追加を押したときの処理 */
  handleAddCondition(index) {
    const { survey, node, addCondition } = this.props;
    const branch = survey.findBranchFromNode(node.getId());
    addCondition(branch.getId(), index);
  }

  /** conditionの追加ボタンを表示するためのliタグを作成する */
  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box" onClick={() => this.handleAddCondition(index)}>
        <div><i className="glyphicon glyphicon-plus-sign" /></div>
      </li>
    );
  }

  /** 描画 */
  render() {
    const { survey, node } = this.props;
    const branch = survey.findBranchFromNode(node.getId());
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
      conditionEls.push(<ConditionInFlow key={key} node={node} branch={branch} condition={condition} />);
      conditionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });

    const elseLabel = survey.calcNodeLabel(node.getNextNodeId());
    const nodeLabel = `分岐 ${survey.calcBranchNo(branch.getId())}`;
    return (
      <NodeInFlow node={node} nodeLabel={nodeLabel} className="condition">
        <ul className="conditions">
          {conditionEls}
          <li className="condition">
            <i className="fa fa-bars drag-handler invisible" />
            &nbsp;
            上記条件以外は{elseLabel}に遷移</li>
        </ul>
      </NodeInFlow>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
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
)(BranchInFlow);

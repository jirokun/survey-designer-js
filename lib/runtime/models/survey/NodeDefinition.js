import { Record } from 'immutable';

export const NodeDefinitionRecord = Record({
  _id: null,
  type: null,             // nodeが参照するものがなにかを表す。page, branch, finisherのいずれか
  refId: null,            // nodeが参照するpage, branch, finisherのid
  nextNodeId: null,       // 次に遷移するnodeのid。typeが'branch'の場合は条件によってbranchの条件が優先される
});

/** Nodeの定義 */
export default class NodeDefinition extends NodeDefinitionRecord {
  getId() {
    return this.get('_id');
  }

  getType() {
    return this.get('type');
  }

  isPage() {
    return this.get('type') === 'page';
  }

  isBranch() {
    return this.get('type') === 'branch';
  }

  isFinisher() {
    return this.get('type') === 'finisher';
  }

  getRefId() {
    return this.get('refId');
  }

  getNextNodeId() {
    return this.get('nextNodeId');
  }

  findSource(survey) {
    // 遷移元のブランチをリストアップ
    const sourceBranches = survey.getBranches().filter(branch => (
      !!branch.getConditions().find(condition => condition.getNextNodeId() === this.getId())
    ));
    const beforeNode = survey.getNodes().find(node => node.getNextNodeId() === this.getId());
    if (beforeNode.isPage()) {
      return sourceBranches.push(survey.findPage(beforeNode.getRefId()));
    } else if (beforeNode.isBranch()) {
      return sourceBranches.push(survey.findBranch(beforeNode.getRefId()));
    }
    return sourceBranches;
  }
}

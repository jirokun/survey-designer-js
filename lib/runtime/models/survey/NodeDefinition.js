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
}

import { Record } from 'immutable';

export const NodeDefinitionRecord = Record({
  _id: null,
  type: null,
  refId: null,
  nextNodeId: null,
});

export default class NodeDefinition extends NodeDefinitionRecord {
  getId() {
    return this.get('_id');
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

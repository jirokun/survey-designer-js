import { Record } from 'immutable';

export const NodeDefinitionRecord = Record({
  id: null,
  type: null,
  refId: null,
  nextNodeId: null,
});

export default class NodeDefinition extends NodeDefinitionRecord {
  getId() {
    return this.get('id');
  }

  isPage() {
    return this.get('type') === 'page';
  }

  getRefId() {
    return this.get('refId');
  }

  getNextNodeId() {
    return this.get('nextNodeId');
  }
}

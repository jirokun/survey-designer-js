import { Record } from 'immutable';

export const FlowDefinitionRecord = Record({
  id: null,
  type: null,
  refId: null,
  nextFlowId: null,
});

export default class FlowDefinition extends FlowDefinitionRecord {
  getId() {
    return this.get('id');
  }

  isPage() {
    return this.get('type') === 'page';
  }
}

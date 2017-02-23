import { Record, List, Map } from 'immutable';

export const SurveyDefinitionRecord = Record({
  _id: '',
  title: '',
  creator: null,
  version: 1,
  pages: List(),
  branches: List(),
  finishers: List(),
  nodes: List(),
  panel: Map(),
});

export default class SurveyDefinition extends SurveyDefinitionRecord {
  getId() {
    return this.get('_id');
  }

  getTitle() {
    return this.get('title');
  }

  getPanel() {
    return this.get('panel');
  }
}

import { Record, List } from 'immutable';

export const SurveyDefinitionRecord = Record({
  title: '',
  creator: null,
  version: 1,
  pages: List(),
  branches: List(),
  finishers: List(),
  nodes: List(),
});

export default class SurveyDefinition extends SurveyDefinitionRecord {
}

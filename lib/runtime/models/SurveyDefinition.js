import { Record, List } from 'immutable';

export const SurveyDefinitionRecord = Record({
  title: '',
  creator: null,
  version: 1,
  pageDefs: List(),
  branchDefs: List(),
  flowDefs: List(),
});

export default class SurveyDefinition extends SurveyDefinitionRecord {
}

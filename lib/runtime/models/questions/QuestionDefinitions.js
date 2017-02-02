import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';

const questionDefinitions = {
  CheckboxQuestionDefinition,
  RadioQuestionDefinition,
  MultiNumberQuestionDefinition,
};

export function findQuestionDefinitionClass(type) {
  return questionDefinitions[`${type}Definition`];
}

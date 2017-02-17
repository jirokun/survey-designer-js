import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';
import SingleTextQuestionDefinition from './SingleTextQuestionDefinition';
import TextQuestionDefinition from './TextQuestionDefinition';
import DescriptionQuestionDefinition from './DescriptionQuestionDefinition';

const questionDefinitions = {
  CheckboxQuestionDefinition,
  RadioQuestionDefinition,
  MultiNumberQuestionDefinition,
  SingleTextQuestionDefinition,
  TextQuestionDefinition,
  DescriptionQuestionDefinition,
};

export function findQuestionDefinitionClass(type) {
  return questionDefinitions[`${type}QuestionDefinition`];
}

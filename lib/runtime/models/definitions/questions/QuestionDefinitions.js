import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';
import SingleTextQuestionDefinition from './SingleTextQuestionDefinition';
import TextQuestionDefinition from './TextQuestionDefinition';
import DescriptionQuestionDefinition from './DescriptionQuestionDefinition';
import ScreeningAgreementQuestionDefinition from './ScreeningAgreementQuestionDefinition';
import ScheduleQuestionDefinition from './ScheduleQuestionDefinition';

const questionDefinitions = {
  CheckboxQuestionDefinition,
  RadioQuestionDefinition,
  MultiNumberQuestionDefinition,
  SingleTextQuestionDefinition,
  TextQuestionDefinition,
  DescriptionQuestionDefinition,
  ScreeningAgreementQuestionDefinition,
  ScheduleQuestionDefinition,
};

export function findQuestionDefinitionClass(type) {
  return questionDefinitions[`${type}QuestionDefinition`];
}

import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';
import SingleTextQuestionDefinition from './SingleTextQuestionDefinition';
import TextQuestionDefinition from './TextQuestionDefinition';
import DescriptionQuestionDefinition from './DescriptionQuestionDefinition';
import ScreeningAgreementQuestionDefinition from './ScreeningAgreementQuestionDefinition';
import ScheduleQuestionDefinition from './ScheduleQuestionDefinition';
import PersonalInfoQuestionDefinition from './PersonalInfoQuestionDefinition';

const questionDefinitions = {
  CheckboxQuestionDefinition,
  RadioQuestionDefinition,
  MultiNumberQuestionDefinition,
  SingleTextQuestionDefinition,
  TextQuestionDefinition,
  DescriptionQuestionDefinition,
  ScreeningAgreementQuestionDefinition,
  ScheduleQuestionDefinition,
  PersonalInfoQuestionDefinition,
};

export function findQuestionDefinitionClass(type) {
  return questionDefinitions[`${type}QuestionDefinition`];
}

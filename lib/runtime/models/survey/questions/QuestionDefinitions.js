import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';
import SingleTextQuestionDefinition from './SingleTextQuestionDefinition';
import TextQuestionDefinition from './TextQuestionDefinition';
import MatrixQuestionDefinition from './MatrixQuestionDefinition';
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
  MatrixQuestionDefinition,
  DescriptionQuestionDefinition,
  ScreeningAgreementQuestionDefinition,
  ScheduleQuestionDefinition,
  PersonalInfoQuestionDefinition,
};

/** dataTypeから対応するDefinitionを取得する */
export function findQuestionDefinitionClass(type) {
  return questionDefinitions[`${type}QuestionDefinition`];
}

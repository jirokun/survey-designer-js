import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import SelectQuestionDefinition from './SelectQuestionDefinition';
import MultiNumberQuestionDefinition from './MultiNumberQuestionDefinition';
import SingleTextQuestionDefinition from './SingleTextQuestionDefinition';
import TextQuestionDefinition from './TextQuestionDefinition';
import MatrixQuestionDefinition from './MatrixQuestionDefinition';
import DescriptionQuestionDefinition from './DescriptionQuestionDefinition';
import ScreeningAgreementQuestionDefinition from './ScreeningAgreementQuestionDefinition';
import ScheduleQuestionDefinition from './ScheduleQuestionDefinition';
import PersonalInfoQuestionDefinition from './PersonalInfoQuestionDefinition';
import PREFECTURES from '../../../../constants/prefectures';

const questionDefinitions = {
  CheckboxQuestionDefinition: { definitionClass: CheckboxQuestionDefinition, options: null },
  RadioQuestionDefinition: { definitionClass: RadioQuestionDefinition, options: null },
  SelectQuestionDefinition: { definitionClass: SelectQuestionDefinition, options: null },
  MultiNumberQuestionDefinition: { definitionClass: MultiNumberQuestionDefinition, options: null },
  SingleTextQuestionDefinition: { definitionClass: SingleTextQuestionDefinition, options: null },
  TextQuestionDefinition: { definitionClass: TextQuestionDefinition, options: null },
  MatrixQuestionDefinition: { definitionClass: MatrixQuestionDefinition, options: null },
  PrefectureQuestionDefinition: { definitionClass: SelectQuestionDefinition, options: { defaultItems: PREFECTURES } },
  DescriptionQuestionDefinition: { definitionClass: DescriptionQuestionDefinition, options: null },
  ScreeningAgreementQuestionDefinition: { definitionClass: ScreeningAgreementQuestionDefinition, options: null },
  ScheduleQuestionDefinition: { definitionClass: ScheduleQuestionDefinition, options: null },
  PersonalInfoQuestionDefinition: { definitionClass: PersonalInfoQuestionDefinition, options: null },
};

/** dataTypeから対応するDefinitionを取得する */
export function findQuestionDefinitionMap(type, additionalOptions) {
  let d = questionDefinitions[`${type}QuestionDefinition`]; // eslint-disable-line prefer-const
  d.options = Object.assign({}, d.options, additionalOptions);
  return d;
}

/** dataTypeから対応するDefinitionを取得する */
export function findQuestionDefaultValuesFromdefinitionClass(type) {
  return questionDefinitions[`${type}QuestionDefinition`];
}

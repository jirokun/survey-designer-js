import CheckboxQuestionEditor from './CheckboxQuestionEditor';
import RadioQuestionEditor from './RadioQuestionEditor';
import MultiNumberQuestionEditor from './MultiNumberQuestionEditor';
import SingleTextQuestionEditor from './SingleTextQuestionEditor';
import TextQuestionEditor from './TextQuestionEditor';
import DescriptionQuestionEditor from './DescriptionQuestionEditor';
import ScreeningAgreementQuestionEditor from './ScreeningAgreementQuestionEditor';
import ScheduleQuestionEditor from './ScheduleQuestionEditor';
import PersonalInfoQuestionEditor from './PersonalInfoQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
  RadioQuestionEditor,
  MultiNumberQuestionEditor,
  SingleTextQuestionEditor,
  TextQuestionEditor,
  DescriptionQuestionEditor,
  ScreeningAgreementQuestionEditor,
  ScheduleQuestionEditor,
  PersonalInfoQuestionEditor,
};

/** dataTypeからQuestionEditorを取得する */
export function findQuestionEditorClass(className) {
  return editors[`${className}QuestionEditor`];
}

import CheckboxQuestion from './CheckboxQuestion';
import RadioQuestion from './RadioQuestion';
import MultiNumberQuestion from './MultiNumberQuestion';
import SingleTextQuestion from './SingleTextQuestion';
import TextQuestion from './TextQuestion';
import DescriptionQuestion from './DescriptionQuestion';
import ScreeningAgreementQuestion from './ScreeningAgreementQuestion';
import ScheduleQuestion from './ScheduleQuestion';
import PersonalInfoQuestion from './PersonalInfoQuestion';

const questions = {
  CheckboxQuestion,
  RadioQuestion,
  MultiNumberQuestion,
  SingleTextQuestion,
  TextQuestion,
  DescriptionQuestion,
  ScreeningAgreementQuestion,
  ScheduleQuestion,
  PersonalInfoQuestion,
};

/** dataTypeから対応するQuestionを取得する */
export function findQuestionClass(className) {
  return questions[`${className}Question`];
}

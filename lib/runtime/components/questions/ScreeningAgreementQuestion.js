import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：調査許諾 */
export default class ScreeningAgreementQuestion extends ChoiceQuestionBase {
  constructor(props) {
    super(props, 'radio');
  }
}

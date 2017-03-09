import RadioQuestionState from '../../states/RadioQuestionState';
import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：調査許諾 */
export default class ScreeningAgreementQuestion extends ChoiceQuestionBase {
  constructor(props) {
    // stateの実装はRadioQuestionStateを使う
    super(props, RadioQuestionState, 'radio');
  }
}

import RadioQuestionState from '../../states/RadioQuestionState';
import ItemBase from './ItemBase';

/** 設問：調査許諾 */
export default class ScreeningAgreementQuestion extends ItemBase {
  constructor(props) {
    // stateの実装はRadioQuestionStateを使う
    super(props, RadioQuestionState, 'radio');
  }
}

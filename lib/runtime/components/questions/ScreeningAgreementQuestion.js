import RadioQuestionState from '../../states/RadioQuestionState';
import ItemBase from './ItemBase';

export default class ScreeningAgreementQuestion extends ItemBase {
  constructor(props) {
    // stteの実装はRadioQuestionStateを使う
    super(props, RadioQuestionState, 'radio');
  }
}

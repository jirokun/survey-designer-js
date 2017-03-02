import RadioQuestionState from '../../states/RadioQuestionState';
import ItemBase from './ItemBase';

/** 設問：単一選択肢 */
export default class RadioQuestion extends ItemBase {
  constructor(props) {
    super(props, RadioQuestionState);
  }
}

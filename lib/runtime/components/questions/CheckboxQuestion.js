import CheckboxQuestionState from '../../states/CheckboxQuestionState';
import ItemBase from './ItemBase';

/** 設問：複数選択肢 */
export default class CheckboxQuestion extends ItemBase {
  constructor(props) {
    super(props, CheckboxQuestionState);
  }
}

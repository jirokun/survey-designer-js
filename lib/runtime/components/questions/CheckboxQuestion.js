import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：複数選択肢 */
export default class CheckboxQuestion extends ChoiceQuestionBase {
  constructor(props) {
    super(props, 'checkbox');
  }
}

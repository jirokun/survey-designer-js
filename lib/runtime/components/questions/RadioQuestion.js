import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：単一選択肢 */
export default class RadioQuestion extends ChoiceQuestionBase {
  constructor(props) {
    super(props, 'radio');
  }
}

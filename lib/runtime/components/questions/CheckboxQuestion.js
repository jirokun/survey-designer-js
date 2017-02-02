import CheckboxQuestionState from '../../models/state/CheckboxQuestionState';
import ChoiceBase from './ChoiceBase';

export default class CheckboxQuestion extends ChoiceBase {
  constructor(props) {
    super(props, 'checkbox', CheckboxQuestionState);
  }
}

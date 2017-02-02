import RadioQuestionState from '../../models/state/RadioQuestionState';
import ChoiceBase from './ChoiceBase';

export default class RadioQuestion extends ChoiceBase {
  constructor(props) {
    super(props, RadioQuestionState, 'radio');
  }
}

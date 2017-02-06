import CheckboxQuestionState from '../../models/state/CheckboxQuestionState';
import ItemBase from './ItemBase';

export default class CheckboxQuestion extends ItemBase {
  constructor(props) {
    super(props, CheckboxQuestionState, 'checkbox');
  }
}

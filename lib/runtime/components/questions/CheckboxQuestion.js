import CheckboxQuestionState from '../../states/CheckboxQuestionState';
import ItemBase from './ItemBase';

export default class CheckboxQuestion extends ItemBase {
  constructor(props) {
    super(props, CheckboxQuestionState, 'checkbox');
  }
}

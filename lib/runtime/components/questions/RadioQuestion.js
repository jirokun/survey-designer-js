import RadioQuestionState from '../../models/state/RadioQuestionState';
import ItemBase from './ItemBase';

export default class RadioQuestion extends ItemBase {
  constructor(props) {
    super(props, RadioQuestionState, 'radio');
  }
}

import CheckboxQuestionState from '../../states/CheckboxQuestionState';
import { connect } from 'react-redux';
import ItemBase from './ItemBase';

/** 設問：複数選択肢 */
class CheckboxQuestion extends ItemBase {
  constructor(props) {
    super(props, CheckboxQuestionState, 'checkbox');
  }
}

const stateToProps = state => ({
  state,
});

export default connect(
  stateToProps,
)(CheckboxQuestion);

import { connect } from 'react-redux';
import CheckboxQuestionState from '../../states/CheckboxQuestionState';
import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：複数選択肢 */
class CheckboxQuestion extends ChoiceQuestionBase {
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

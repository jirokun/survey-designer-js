import { connect } from 'react-redux';
import RadioQuestionState from '../../states/RadioQuestionState';
import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：単一選択肢 */
class RadioQuestion extends ChoiceQuestionBase {
  constructor(props) {
    super(props, RadioQuestionState, 'radio');
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(RadioQuestion);


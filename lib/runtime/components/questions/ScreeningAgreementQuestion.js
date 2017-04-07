import { connect } from 'react-redux';
import RadioQuestionState from '../../states/RadioQuestionState';
import ChoiceQuestionBase from './ChoiceQuestionBase';

/** 設問：調査許諾 */
class ScreeningAgreementQuestion extends ChoiceQuestionBase {
  constructor(props) {
    // stateの実装はRadioQuestionStateを使う
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
)(ScreeningAgreementQuestion);

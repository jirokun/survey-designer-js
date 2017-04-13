import React, { Component } from 'react';
import { connect } from 'react-redux';

/** 設問：単一選択肢 */
class Value extends Component {
  render() {
    const { survey, value, className } = this.props;
    const replacer = survey.getReplacer();
    if (replacer.containsReferenceIdIn(value)) {
      return <span className={className === undefined ? 'answer-value' : className}>再掲 {replacer.findReferenceOutputDefinitionsIn(value)[0].getOutputNo()}</span>;
    }
    return <span>{value}</span>;
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
)(Value);



import React, { Component } from 'react';
import { connect } from 'react-redux';

/** 設問：単一選択肢 */
class Value extends Component {
  render() {
    const { survey, value } = this.props;
    const replacer = survey.getReplacer();
    if (replacer.isIncludeName(value)) {
      return <span className="answer-value">{replacer.findReferenceOutputDefinitions(value)[0].getLabelForDetail()}</span>;
    }
    return <span className="fixed-value">{value}</span>;
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



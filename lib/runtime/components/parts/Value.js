import React, { Component } from 'react';
import { connect } from 'react-redux';

/** 詳細プレビューで使用する値の表示のためのコンポーネント */
class Value extends Component {
  render() {
    const { survey, value, className } = this.props;
    const replacer = survey.getReplacer();
    if (replacer.containsReferenceIdIn(value)) {
      return <span className={className === undefined ? 'answer-value' : className}>再掲 {replacer.findReferenceOutputDefinitionsIn(value)[0].getOutputNo()}</span>;
    }
    if (!replacer.validate(value, survey.getAllOutputDefinitions())) {
      return <span className="alert-value">エラー 不正な参照です</span>;
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



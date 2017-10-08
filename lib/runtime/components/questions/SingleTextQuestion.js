/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：1行テキスト */
class SingleTextQuestion extends Component {
  render() {
    const { survey, replacer, question } = this.props;
    const name = question.getOutputName();

    return (
      <div className="SingleTextQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <input
            type="text"
            name={name}
            id={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
            data-parsley-maxlength="20"
          />
          <p>※20文字まで</p>
        </div>
      </div>
    );
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
)(SingleTextQuestion);

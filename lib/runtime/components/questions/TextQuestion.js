/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：複数行テキスト */
class TextQuestion extends Component {
  render() {
    const { survey, replacer, question } = this.props;
    const name = question.getOutputName();

    return (
      <div className="TextQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <textarea
            name={name}
            id={name}
            className="freetext"
            rows="6"
            cols="40"
            data-output-no={survey.findOutputNoFromName(name)}
            data-response-key="value"
            data-response-multiple={false}
            data-parsley-required
          />
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
)(TextQuestion);

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ItemVisibility from '../../../constants/ItemVisibility';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from './CommonQuestionParts';

/** 設問：単一選択肢(select) */
class SelectQuestion extends Component {
  createItem(item) {
    const { survey, runtime, options } = this.props;
    // RadioやCheckboxはclass=hiddenとしているが、selectの場合要素を消さないと選択を外すことができない
    // したがってCLASS_NAME_HIDDENの場合にはnullを返す
    if (!options.isVisibilityConditionDisabled() && item.calcVisibilityClassName(survey, runtime.getAnswers()) === ItemVisibility.CLASS_NAME_HIDDEN) {
      return null;
    }

    return <option key={`${item.getId()}-select-option`} value={item.getIndex() + 1}>{item.getPlainLabel()}</option>;
  }

  render() {
    const { survey, replacer, question, options } = this.props;
    const name = question.getOutputName();

    return (
      <div className="SelectQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <select
            name={name}
            id={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
          >
            <option value="" />
            {question.getItems().map(item => this.createItem(item))}
          </select>
        </div>
        { options.isShowDetail() ? <QuestionDetail question={question} /> : null }
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
)(SelectQuestion);

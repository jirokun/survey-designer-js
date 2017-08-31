import { connect } from 'react-redux';
import React, { Component } from 'react';
import S from 'string';
import classNames from 'classnames';

/** 設問：日程 */
class ScheduleQuestion extends Component {
  render() {
    const { survey, page, replacer, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const otherName = question.getOutputName(true);

    return (
      <div className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" data-dev-id-label={question.getDevId()} dangerouslySetInnerHTML={{ __html: replacer.id2Span(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Span(description) }} />}
        <div className="question">
          <table id={question.getId()} className="sdj-schedule schedulecheck group schedule errPosRight">
            <tbody>
              <tr id="grid_th" className="color02 ">
                <td><b>日程</b></td>
                <td><b>A.<br />午前<br />9:00～12:00</b></td>
                <td><b>B.<br />午後<br />12:00～16:00</b></td>
                <td><b>C.<br />夜間<br />16:00 以降</b></td>
              </tr>
              {
                question.getItems().map((item, itemIndex) =>
                  <ScheduleRow
                    key={item.getId()}
                    survey={survey}
                    page={page}
                    replacer={replacer}
                    question={question}
                    item={item}
                    itemIndex={itemIndex}
                    {...this.props}
                  />,
                )
              }
              <tr className="color01 exclusion">
                <td>上記のいずれも都合がつかない</td>
                <td colSpan="3">
                  <input
                    type="checkbox"
                    className="exclusion"
                    data-parsley-class-handler={`#${question.getId()}`}
                    data-parsley-required
                    data-parsley-required-message="日時枠を一つ以上選択してください"
                    data-parsley-multiple={question.getId()}
                  />&nbsp;
                  <span className="check-not-text" />
                  <input
                    type="text"
                    disabled
                    className="schedule-text disabled"
                    id={otherName}
                    name={otherName}
                    data-output-no={survey.findOutputNoFromName(otherName)}
                    data-parsley-required
                    data-parsley-required-message="具体的な時間帯を記入してください"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

/** 日程の1行に対応するコンポーネント */
class ScheduleRow extends Component {
  render() {
    const { survey, runtime, options, question, item, itemIndex } = this.props;
    const label = item.getLabel();
    const className = classNames('color01', {
      [item.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
    });
    const replacer = survey.getReplacer();
    return (
      <tr className={className}>
        <td className="left" dangerouslySetInnerHTML={{ __html: replacer.id2Span(label) }} />
        {[1, 2, 3].map((periodNo) => {
          const name = question.getOutputName(false, itemIndex, periodNo);
          return (
            <td key={`${name}-td${periodNo}`}>
              <input
                type="checkbox"
                data-parsley-class-handler={`#${question.getId()}`}
                data-parsley-required
                data-parsley-required-message="日時枠を一つ以上選択してください"
                data-parsley-multiple={question.getId()}
              />&nbsp;
              <span className="check-not-text" />
              <input
                type="text"
                id={name}
                name={name}
                disabled
                className="schedule-text disabled"
                data-output-no={survey.findOutputNoFromName(name)}
                data-parsley-required
                data-parsley-required-message="具体的な時間帯を記入してください"

              />
            </td>
          );
        })}
      </tr>
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
)(ScheduleQuestion);




import React, { Component } from 'react';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：日程 */
export default class ScheduleQuestion extends Component {
  render() {
    const { survey, page, replacer, question } = this.props;
    const otherName = question.getOutputName(true);
    const pageNo = survey.calcPageNo(page.getId());
    const questionNo = survey.calcQuestionNo(page.getId(), question.getId());
    const outputDefinitions = question.getOutputDefinitions(pageNo, questionNo);

    return (
      <div className="ScheduleQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <table id={question.getId()} className="sdj-schedule schedulecheck group schedule errPosRight">
            <tbody>
              <tr id="grid_th" className="color02 ">
                <td><b>日程</b></td>
                {question.getSubItems().map(period => <td key={period.getId()} id={period.getId()} dangerouslySetInnerHTML={{ __html: period.getLabel() }} />)}
              </tr>
              {
                question.getItems().map((item, itemIndex) =>
                  <ScheduleRow
                    key={item.getId()}
                    survey={survey}
                    page={page}
                    replacer={replacer}
                    question={question}
                    outputDefinitions={outputDefinitions}
                    item={item}
                    itemIndex={itemIndex}
                    {...this.props}
                  />,
                )
              }
              <tr className="color01 exclusion" id={`${question.getId()}_other`}>
                <td>上記のいずれも都合がつかない</td>
                <td colSpan={question.getSubItems().size}>
                  <input
                    id={question.getToggleCheckboxIdByOutputDefinition(question.getOtherOutputDefinition())}
                    type="checkbox"
                    className="exclusion"
                    data-parsley-class-handler={`#${question.getId()}`}
                    data-parsley-required
                    data-parsley-required-message="日時枠を一つ以上選択してください"
                    data-parsley-multiple={question.getId()}
                  />&nbsp;
                  <span className="select-tool check-not-text" />
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
    const { survey, question, outputDefinitions, item, itemIndex } = this.props;
    const label = item.getLabel();
    const replacer = survey.getReplacer();
    const periods = question.getSubItems();
    return (
      <tr className="color01" id={item.getId()}>
        <td className="left" dangerouslySetInnerHTML={{ __html: replacer.id2Span(label) }} />
        {periods.map((period, periodIndex) => {
          const name = question.getOutputName(false, itemIndex, periodIndex + 1);
          const od = outputDefinitions.find(outputDefinition => outputDefinition.getName() === name);
          return (
            <td key={`${name}-td${periodIndex + 1}`}>
              <input
                type="checkbox"
                id={question.getToggleCheckboxIdByOutputDefinition(od)}
                data-parsley-class-handler={`#${question.getId()}`}
                data-parsley-required
                data-parsley-required-message="日時枠を一つ以上選択してください"
                data-parsley-multiple={question.getId()}
              />&nbsp;
              <span className="select-tool check-not-text" />
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

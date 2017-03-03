import React, { Component } from 'react';
import classNames from 'classnames';
import S from 'string';
import { r } from '../../../utils';
import ScheduleQuestionState from '../../states/ScheduleQuestionState';

/** 設問：日程 */
export default class ScheduleQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = { model: new ScheduleQuestionState(props.question.getItems().size) };
  }

  /**
   * Reactのライフサイクルメソッド
   * propsが変わったら対応するmodelも変更する
   */
  componentWillReceiveProps(nextProps) {
    this.setState({ model: new ScheduleQuestionState(nextProps.question.getItems().size) });
  }

  /** チェックボックスのchangeハンドラ */
  handleCheckBoxChange(itemIndex, periodIndex, checked) {
    const model = this.state.model.updateCheckState(itemIndex, periodIndex, checked);
    this.setState({ model });
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const checkState = this.state.model.getCheckState();
    const otherChecked = this.state.model.isOtherChecked();
    const otherName = question.getOutputName(true);
    const answers = {};

    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: r(title, answers) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />}
        <div className="question">
          <table id={question.getId()} className="schedulecheck group schedule errPosRight">
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
                    question={question}
                    item={item}
                    itemIndex={itemIndex}
                    handleCheckBoxChange={(periodIndex, checked) => this.handleCheckBoxChange(itemIndex, periodIndex, checked)}
                    checkState={checkState.get(itemIndex)}
                  />,
                )
              }
              <tr className="color01 exclusion">
                <td>上記のいずれも都合がつかない</td>
                <td colSpan="3">
                  <input
                    type="checkbox"
                    onChange={e => this.handleCheckBoxChange(question.getItems().size, 0, e.target.checked)}
                    checked={otherChecked}
                    data-parsley-class-handler={`#${question.getId()}`}
                    data-parsley-required
                    data-parsley-required-message="日時枠を一つ以上選択してください"
                    data-parsley-multiple={question.getId()}
                  />&nbsp;
                  <input
                    type="text"
                    className={classNames('schedule-text', { disabled: !otherChecked })}
                    disabled={!otherChecked}
                    id={otherName}
                    name={otherName}
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
    const { question, item, itemIndex, checkState, handleCheckBoxChange } = this.props;
    const label = item.getLabel();
    return (
      <tr className="color01">
        <td className="left">{label}</td>
        {[1, 2, 3].map((periodNo, i) => {
          const id = question.getOutputName(false, itemIndex, periodNo);
          const checked = checkState.get(i);
          return (
            <td key={`${id}-td${periodNo}`}>
              <input
                type="checkbox"
                onChange={e => handleCheckBoxChange(i, e.target.checked)}
                checked={checked}
                data-parsley-class-handler={`#${question.getId()}`}
                data-parsley-required
                data-parsley-required-message="日時枠を一つ以上選択してください"
                data-parsley-multiple={question.getId()}
              />&nbsp;
              <input
                type="text"
                className={classNames('schedule-text', { disabled: !checked })}
                disabled={!checked}
                id={`${id}`}
                name={`${id}`}
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

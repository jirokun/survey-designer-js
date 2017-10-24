import React, { Component } from 'react';
import classNames from 'classnames';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';
import CheckboxQuestionDefinition from '../../models/survey/questions/CheckboxQuestionDefinition';
import RadioQuestionDefinition from '../../models/survey/questions/RadioQuestionDefinition';

/** CheckboxQuestion, RadioQuestionの基底クラス */
export default class ChoiceQuestionBase extends Component {
  static getContainerId(question) {
    return `${question.getId()}-list-container`;
  }

  constructor(props, inputType) {
    super(props);
    this.inputType = inputType;
  }

  /** itemを描画する */
  createItems(containerId) {
    const { survey, runtime, replacer, question, options } = this.props;
    const items = question.getItems();
    if (items.size === 0) {
      throw new Error('items attribute is not defined');
    }
    return items.map(item => (
      <Item
        key={`${question.getId()}_${item.getIndex()}`}
        containerId={containerId}
        survey={survey}
        runtime={runtime}
        question={question}
        inputType={this.inputType}
        item={item} // itemDefitionのインスタンス
        replacer={replacer}
        options={options}
      />
    ));
  }

  /** 描画 */
  render() {
    const { replacer, question, options } = this.props;
    const containerId = ChoiceQuestionBase.getContainerId(question);
    return (
      <div className="ChoiceQuestionBase">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question">
          <ul id={containerId} className="checkbox validation-hover-target">
            {this.createItems(containerId)}
          </ul>
        </div>
        { options.isShowDetail() && question.getDataType() !== 'ScreeningAgreement' ? (
          <QuestionDetail
            {...this.props}
            optional={question.getDataType() === 'Radio'}
            random
            minCheckCount={question.getDataType() === 'Checkbox'}
            maxCheckCount={question.getDataType() === 'Checkbox'}
          />) : null }
      </div>
    );
  }
}

/**
 * itemに対応するコンポーネント
 * RadioかCheckboxのいずれかが対応する
 */
export class Item extends Component {
  static createInputElement(survey, question, item, options = null) {
    let outputDefinition;
    const dataType = question.getDataType();
    if (question instanceof CheckboxQuestionDefinition) {
      outputDefinition = question.getOutputDefinitionFromItem(item, false);
    } else if (question instanceof RadioQuestionDefinition) {
      outputDefinition = question.getOutputDefinition();
    } else {
      throw new Error(`Unkown dataType: ${dataType}`);
    }
    const inputType = outputDefinition.getOutputType();
    const name = outputDefinition.getName();
    const containerId = ChoiceQuestionBase.getContainerId(question);
    const replacer = survey.getReplacer();
    const errorContainerId = `${item.getId()}_error_container`;
    const value = item.getValue();
    const label = item.getLabel();

    // TODO output noはpageLoadのタイミングでつける
    return (
      <span>
        <input
          className="question-form-list-input"
          type={inputType}
          name={name}
          value={value}
          data-parsley-class-handler={`#${containerId}`}
          data-parsley-required={question.getMinCheckCount() > 0}
          data-parsley-mincheck={dataType === 'Checkbox' && question.getMinCheckCount() !== 0 ? question.getMinCheckCount() : null}
          data-parsley-maxcheck={dataType === 'Checkbox' && question.getMaxCheckCount() !== 0 ? question.getMaxCheckCount() : null}
          data-parsley-maxcheck-message="%s 個以下で選択してください"
          data-parsley-multiple={question.getId()}
        />
        <span className="select-tool" dangerouslySetInnerHTML={{ __html: replacer.id2Span(label) }} />
        {Item.createAdditionalInput(survey, question, item, errorContainerId)}
        <span id={errorContainerId} />
      </span>
    );
  }

  /** additionalInputを描画する */
  static createAdditionalInput(survey, question, item, errorContainerId) {
    if (!item.hasAdditionalInput()) return null;
    const type = item.getAdditionalInputType();
    const name = question.getOutputName(item.getIndex(), true);
    const unit = item.getUnit();
    const replacer = survey.getReplacer();

    return (
      <span>
        <input
          type="text"
          pattern={type === 'number' ? '\\d*' : null}
          maxLength={type === 'number' ? 16 : 100}
          name={name}
          data-parsley-errors-container={`#${errorContainerId}`}
          data-output-no={survey.findOutputNoFromName(name)}
          data-parsley-required
          data-parsley-positive-integer={type === 'number' ? true : null}
          className={classNames('additionalInput', 'disabled', { number: type === 'number' })}
          onClick={e => e.preventDefault()}
          disabled
        />
        <span dangerouslySetInnerHTML={{ __html: replacer.id2Span(unit) }} />
      </span>
    );
  }

  render() {
    const { survey, options, item, question } = this.props;

    const label = item.getLabel();

    return (
      <li className="question-form-list" data-row-order={item.getIndex() + 1}>
        <label className={classNames('question-form-list-label')}>
          { Item.createInputElement(survey, question, item, options) }
        </label>
      </li>
    );
  }
}

/* eslint-env browser */
import React, { Component } from 'react';
import classNames from 'classnames';
import ItemDefinition from '../../models/survey/questions/internal/ItemDefinition';
import QuestionDetail from '../parts/QuestionDetail';
import * as CommonQuestionParts from '../parts/CommonQuestionParts';

/** 設問：数値記入 */
export default class MultiNumberQuestion extends Component {
  /** 制御情報を作成する */
  createItemDetail(item) {
    const { options, question } = this.props;
    if (!options.isShowDetail()) return null;

    if (!question.isRandom() || !item.isRandomFixed()) return null;
    return (
      <span className="detail-function" style={{ verticalAlign: 'top' }}>ランダム固定</span>
    );
  }

  /** additionalInputを描画する */
  createAdditionalInput(item, question, errorContainerId) {
    if (!item.hasAdditionalInput()) return null;
    const { survey, replacer } = this.props;
    const type = item.getAdditionalInputType();
    const name = question.getAdditionalOutputName(item.getIndex());
    const unit = item.getUnit();

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
          className={classNames('additionalInput', { number: type === 'number' })}
          onClick={e => e.preventDefault()}
        />
        <span dangerouslySetInnerHTML={{ __html: replacer.id2Span(unit) }} />
      </span>
    );
  }

  /** itemに対応するelementを作成する */
  createItem(item, isTotal = false) {
    const { survey, replacer, question } = this.props;
    const name = isTotal ? question.getTotalOutputName() : question.getOutputName(item.getIndex());
    const errorContainerId = `${name}_error_container`;

    const className = classNames('multiNumberLine', {
      multiNumberTotal: isTotal,
    });

    return (
      <div key={`${question.getId()}_${item.getIndex()}`} className={className} data-row-order={isTotal ? 'total' : item.getIndex() + 1}>
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: replacer.id2Span(item.getLabel()) }} />
          {this.createAdditionalInput(item, question, errorContainerId)}
        </div>
        <div className="multiNumberAssociated mini">
          <div className="multiNumberInput">
            <input
              type="text"
              pattern="\d*"
              maxLength="16"
              id={name}
              name={name}
              className={classNames('sdj-numeric', { disabled: isTotal })}
              readOnly={isTotal}
              data-output-no={survey.findOutputNoFromName(name)}
              data-response-multiple
              data-response-item-index={isTotal ? null : item.getIndex()}
              data-parsley-required={!isTotal}
              data-parsley-positive-integer
              data-parsley-errors-container={`#${errorContainerId}`}
            />
            <span className="multiNumberUnit"> {question.getUnit()}</span>
            <span id={errorContainerId} />
          </div>
        </div>
        {this.createItemDetail(item)}
      </div>
    );
  }

  /** itemsに対応するelementを作成する */
  createItems() {
    const { question } = this.props;
    const items = question.getItems();
    if (items.size === 0) {
      throw new Error('items attribute is not defined');
    }
    return items.map(item => this.createItem(item));
  }

  /** 合計のelementを作成する */
  createTotalItem() {
    const { question } = this.props;
    if (!question.isShowTotal()) {
      return null;
    }
    return this.createItem(new ItemDefinition({ devId: `${question.getDevId()}_total`, label: '合計' }), true);
  }

  render() {
    const { replacer, question, options } = this.props;
    return (
      <div ref={(el) => { this.rootEl = el || this.rootEl; }} className="MultiNumberQuestion">
        { CommonQuestionParts.title(question, replacer) }
        { CommonQuestionParts.description(question, replacer) }
        <div className="question validation-hover-target">
          {this.createItems()}
          {this.createTotalItem()}
        </div>
        { options.isShowDetail() ? <QuestionDetail {...this.props} random /> : null }
      </div>
    );
  }
}

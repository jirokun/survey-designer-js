/* eslint-env browser */
import React from 'react';
import $ from 'jquery';
import S from 'string';
import Parsley from 'parsleyjs';
import { r, parseInteger } from '../../../utils';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';
import ItemDefinition from '../../models/survey/questions/ItemDefinition';

/** 設問：数値記入 */
export default class MultiNumberQuestion extends TransformQuestion {
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    this.rootEl.addEventListener('change', () => this.setTotalValue(), false);
    this.rootEl.addEventListener('keyup', () => this.setTotalValue(), false);
  }

  /** 各itemに使用するidを生成する */
  generateId(index, isTotal = false) {
    const { question } = this.props;
    return isTotal ? `${question.getId()}__total` : `${question.getId()}__value${index + 1}`;
  }

  /** 入力値をもとに合計値を設定する */
  setTotalValue() {
    const idList = this.state.model.getTransformedItems().map(item => this.generateId(item.getIndex())).toList();
    const doc = this.rootEl.ownerDocument;
    const total = idList.reduce((reduction, id) => reduction + parseInteger(doc.getElementById(id).value), 0);
    const totalId = this.generateId(null, true);
    const totalEl = doc.getElementById(totalId);
    if (!totalEl) return;
    totalEl.value = total;
    $(totalEl).parsley().validate();
  }

  /** itemに対応するelementを作成する */
  makeItem(item, isTotal = false) {
    const { question } = this.props;
    const answers = {};
    const id = this.generateId(item.getIndex(), isTotal);
    const totalEqualTo = question.getTotalEqualTo();
    const hiddenId = `${id}-hidden`;
    return (
      <div ref={(el) => { this.rootEl = el; }} key={`${question.getId()}_${item.getIndex()}`} className={`multiNumberLine ${isTotal ? 'multiNumberTotal' : ''}`}>
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: r(item.getLabel(), answers) }} />
        </div>
        <div className="multiNumberAssociated mini">
          <div className="multiNumberInput">
            <input
              type="text"
              maxLength="16"
              id={id}
              name={id}
              data-key="value"
              className={isTotal ? 'disabled' : ''}
              readOnly={isTotal}
              data-response-multiple
              data-response-item-index={isTotal ? null : item.getIndex()}
              data-parsley-required
              data-parsley-type="digits"
              data-parsley-min={isTotal || S(question.getMin()).isEmpty() ? null : question.getMin()}
              data-parsley-max={isTotal || S(question.getMax()).isEmpty() ? null : question.getMax()}
              data-parsley-equalto={isTotal && !S(totalEqualTo).isEmpty() ? `#${hiddenId}` : null}
              data-parsley-equalto-message={`合計が${totalEqualTo}になるように入力してください`}
            />
            { isTotal ? <input type="hidden" id={hiddenId} value={totalEqualTo} /> : null }
            <span className="multiNumberUnit"> {question.getUnit()}</span>
          </div>
        </div>
      </div>
    );
  }

  /** itemsに対応するelementを作成する */
  makeItems() {
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      throw new Error('items attribute is not defined');
    }
    return items.map(item => this.makeItem(item));
  }

  /** 合計のelementを作成する */
  makeTotalItem() {
    const { question } = this.props;
    if (!question.isShowTotal()) {
      return null;
    }
    return this.makeItem(new ItemDefinition({ label: '合計' }), true);
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: r(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: r(description, answers) }} />
        <div className="question validation-hover-target">
          {this.makeItems()}
          {this.makeTotalItem()}
        </div>
      </div>
    );
  }
}

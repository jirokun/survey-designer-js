/* eslint-env browser */
import React from 'react';
import $ from 'jquery';
import Parsley from 'parsleyjs';
import * as Utils from '../../../utils';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../models/state/MultiNumberQuestionState';
import ItemDefinition from '../../models/definitions/questions/ItemDefinition';

export default class MultiNumberQuestion extends TransformQuestion {
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  componentDidMount() {
    this.rootEl.addEventListener('change', () => this.setTotalValue(), false);
    this.rootEl.addEventListener('keyup', () => this.setTotalValue(), false);
  }

  generateId(index, isTotal) {
    const { question } = this.props;
    return isTotal ? `${question.getId()}-total` : `${question.getId()}-${index}`;
  }

  setTotalValue() {
    const { model } = this.state;
    const idList = model.getTransformedItems().map(item => this.generateId(item.getIndex())).toList();
    const total = idList.reduce((reduction, value) => {
      const num = parseInt(this.rootEl.querySelector(`#${value}`).value, 10);
      return reduction + (isNaN(num) ? 0 : num);
    }, 0);
    const totalId = this.generateId(null, true);
    const $totalEl = $(`#${totalId}`);
    $totalEl.val(total);
    $totalEl.parsley().validate();
  }

  makeItem(item, isTotal = false, totalEqualTo) {
    const { question } = this.props;
    const inputValues = {};
    const id = this.generateId(item.getIndex(), isTotal);
    const hiddenId = `${id}-hidden`;
    return (
      <div key={`${question.getId()}_${item.getIndex()}`} className={`multiNumberLine ${isTotal ? 'multiNumberTotal' : ''}`}>
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: Utils.r(item.getLabel(), inputValues) }} />
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
              data-parsley-min={question.getMin()}
              data-parsley-max={question.getMax()}
              data-parsley-equalto={isTotal ? `#${hiddenId}` : null}
              data-parsley-equalto-message={`合計が${totalEqualTo}になるように入力してください`}
            />
            { isTotal ? <input type="hidden" id={hiddenId} value={totalEqualTo} /> : null }
            <span className="multiNumberUnit"> {question.getUnit()}</span>
          </div>
        </div>
      </div>
    );
  }

  makeItems() {
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      return Utils.errorMessage('items attribute is not defined');
    }
    return items.map(item => this.makeItem(item));
  }

  makeTotalItem() {
    const { question } = this.props;
    if (!question.isShowTotal()) {
      return null;
    }
    return this.makeItem(new ItemDefinition({ label: '合計' }), true, question.getTotalEqualTo());
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const inputValues = {};
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(description, inputValues) }} />
        <div className="question validation-hover-target">
          {this.makeItems()}
          {this.makeTotalItem()}
        </div>
      </div>
    );
  }
}

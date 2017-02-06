import React, { Component } from 'react';
import * as Utils from '../../../utils';
import TransformQuestion from './TransformQuestion';

export default class ItemBase extends TransformQuestion {
  handleCheckboxChange(e) {
    const { model } = this.state;
    const itemIndex = parseInt(e.target.dataset.itemIndex, 10);
    this.setState({ model: model.setItemState(itemIndex, e.target.checked) });
  }

  makeItems(containerId) {
    const { question } = this.props;
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      return Utils.errorMessage('items attribute is not defined');
    }
    return items.map(item => (
      <Item
        key={`${question.getId()}_${item.getIndex()}`}
        containerId={containerId}
        question={question}
        inputType={this.inputType}
        item={item}
        itemState={model.getItemStateByItemIndex(item.getIndex())}
        handleCheckboxChange={e => this.handleCheckboxChange(e)}
      />
    ));
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const inputValues = {};
    const containerId = `${question.getId()}-ul-container`;
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(description, inputValues) }} />
        <div className="question">
          <ul id={containerId} className="checkbox validation-hover-target">
            {this.makeItems(containerId)}
          </ul>
        </div>
      </div>
    );
  }
}

class Item extends Component {
  renderInput(question, item, itemState) {
    let type;
    if (item.hasTextInput()) type = 'text';
    else if (item.hasNumberInput()) type = 'number';
    else return null;
    const disabled = !itemState.get('checked');
    return (
      <input
        type={type}
        name={question.getId()}
        data-key="freeText"
        data-parsley-required
        data-parsley-type={type === 'number' ? 'digits' : null}
        data-parsley-type-message="半角数字のみで入力してください"
        data-item-index={item.getIndex()}
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { containerId, itemState, inputType, item, question, handleCheckboxChange } = this.props;
    const label = item.getLabel();
    const unit = item.getUnit();
    const inputValues = {};
    const disabled = !!itemState.get('disabled');
    const className = `question-form-list ${disabled ? 'disabled' : ''}`;
    return (
      <li className={className}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type={inputType}
            name={question.getId()}
            value="on"
            checked={itemState.get('checked')}
            onChange={handleCheckboxChange}
            data-key="checked"
            data-item-index={item.getIndex()}
            disabled={disabled}
            data-parsley-class-handler={`#${containerId}`}
            data-parsley-required={question.getMinCheckCount() > 0}
            data-parsley-mincheck={question.getMinCheckCount() !== 0 ? question.getMinCheckCount() : null}
            data-parsley-maxcheck={question.getMaxCheckCount() !== 0 ? question.getMaxCheckCount() : null}
          />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          {this.renderInput(question, item, itemState)}
          <span dangerouslySetInnerHTML={{ __html: Utils.r(unit, inputValues) }} />
        </label>
      </li>
    );
  }
}

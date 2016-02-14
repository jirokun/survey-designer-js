import React, { Component, PropTypes } from 'react'
import * as CheckboxItem from '../items/CheckboxItem'
import * as RadioItem from '../items/RadioItem'
import * as TextItem from '../items/TextItem'
import * as SelectItem from '../items/SelectItem'
import { findItems, findItemConstructor } from '../../../utils'

export default class DefaultQuestion extends Component {
  makeItem(item) {
    switch (item.itemType) {
      case 'RadioItem':
        return this.makeRadio(item);
      case 'CheckboxItem':
        return this.makeCheckbox(item);
      case 'TextItem':
        return this.makeText(item);
      case 'SelectItem':
        return this.makeSelect(item);
      default:
        return;
    }
  }
  makeItems() {
    const { question, valueChange, state } = this.props;
    return findItems(state, question.id).map((item) => {
      return (
        <div key={'item-' + item.id}>
          <h4>{item.itemTitle}</h4>
          {this.makeItem(item)}
        </div>
      );
    });
  }
  render() {
    const { question, items } = this.props;
    return (
      <div>
        <h3>{question.questionTitle}</h3>
        {this.makeItems()}
      </div>
    );
  }
}

DefaultQuestion.propTypes = {
};

[
  CheckboxItem,
  RadioItem,
  SelectItem,
  TextItem
].forEach((item) => {
  for (const prop in item) {
    DefaultQuestion.prototype[prop] = item[prop];
  }
});

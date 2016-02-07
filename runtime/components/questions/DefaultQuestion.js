import React, { Component, PropTypes } from 'react'
import CheckboxItem from '../items/CheckboxItem'
import RadioItem from '../items/RadioItem'
import { findItems, findItemConstructor } from '../../../utils'

export default class DefaultQuestion extends Component {
  makeItems() {
    const { question, valueChange, state } = this.props;
    return findItems(state, question.id).map((item) => {
      return React.createElement(findItemConstructor(item.itemType), Object.assign({}, { item, state, valueChange }));
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
  questionTitle: PropTypes.string.isRequired
};

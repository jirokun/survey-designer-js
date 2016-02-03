import React, { Component, PropTypes } from 'react'
import CheckboxItem from '../items/CheckboxItem'
import RadioItem from '../items/RadioItem'
import { findItem } from '../../../utils'

export default class DefaultQuestion extends Component {
  makeItems(items) {
    const { valueChange, state } = this.props;
    return items.map((item) => {
      return React.createElement(findItem(item.itemType), Object.assign({}, item, { state, valueChange }));
    });
  }
  render() {
    const { questionTitle, items } = this.props;
    return (
      <div>
        <h3>{questionTitle}</h3>
        {this.makeItems(items)}
      </div>
    );
  }
}

DefaultQuestion.propTypes = {
  questionTitle: PropTypes.string.isRequired
};

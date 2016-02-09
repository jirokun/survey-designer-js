import React, { Component, PropTypes } from 'react'
import { findChoices } from '../../../utils'

export default class CheckboxItem extends Component {
  handleChange(e) {
    var els = this.refs.container.querySelectorAll('input');
    var values = {};

    Array.prototype.forEach.call(els, (el) => { values[el.value] = el.checked; });
    this.props.valueChange(this.props.item.itemName, values);
  }
  makeCheckbox() {
    const { state, item } = this.props;
    const value = state.values.inputValues[item.itemName] || {};
    return findChoices(state, item.id).map((choice, i) => {
      return (
        <label key={item.id + i}>
          <input id={choice.id} type="checkbox" name={item.itemName} value={choice.value} onChange={this.handleChange.bind(this)} checked={value[choice.value]}/>
          {choice.label}
        </label>
      );
    });
  }
  render() {
    const { state, item } = this.props;
    return (
      <div ref="container">
        <h3>{item.itemTitle}</h3>
        {this.makeCheckbox()}
      </div>
    );
  }
}

CheckboxItem.propTypes = {
};


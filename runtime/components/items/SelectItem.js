import React, { Component, PropTypes } from 'react'
import { findChoices } from '../../../utils'

export default class SelectItem extends Component {
  handleChange(e) {
    this.props.valueChange(this.props.item.itemName, e.target.value);
  }
  makeOption() {
    const { state, item } = this.props;
    const value = this.props.state.values.inputValues[item.itemName];
    return findChoices(state, item.id).map((choice, i) =>
      <option value={choice.value} selected={value === choice.value}>{choice.label}</option>
    );
  }
  render() {
    const { state, item } = this.props;
    return (
      <div>
        <h3>{item.itemTitle}</h3>
        <select name={item.itemName} onChange={this.handleChange.bind(this)}>
          {this.makeOption()}
        </select>
      </div>
    );
  }
}

SelectItem.propTypes = {
};

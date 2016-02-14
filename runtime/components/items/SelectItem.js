import React, { Component, PropTypes } from 'react'
import { findChoices } from '../../../utils'

export function handleSelectChange(e) {
  const { name, value } = e.target;
  this.props.valueChange(name, value);
}
export function makeSelect(item) {
  const { state } = this.props;
  const value = this.props.state.values.inputValues[item.itemName];
  const options = findChoices(state, item.id).map((choice, i) =>
    <option value={choice.value} selected={value === choice.value}>{choice.label}</option>
  );
  return (
    <select name={item.itemName} onChange={this.handleSelectChange.bind(this)}>
      {options}
    </select>
  );
}

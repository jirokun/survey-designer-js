import React, { Component, PropTypes } from 'react'
import { findChoices } from '../../../utils'

export function handleRadioChange(e) {
  const { name, value } = e.target;
  this.props.valueChange(name, value);
}
export function makeRadio(item) {
  const { state } = this.props;
  const value = this.props.state.values.inputValues[item.itemName];
  return findChoices(state, item.id).map((choice, i) => {
    return (
      <label key={item.id + i}>
        <input type="radio" name={item.itemName} value={choice.value} onChange={this.handleRadioChange.bind(this)} checked={value === choice.value}/>
        {choice.label}
      </label>
    );
  });
}

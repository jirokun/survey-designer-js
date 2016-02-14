import React, { Component, PropTypes } from 'react'
import { findChoices } from '../../../utils'

export function handleCheckboxChange(e) {
  const { name } = e.target;
  const els = e.target.ownerDocument.getElementsByName(name);
  var values = {};
  Array.prototype.forEach.call(els, (el) => { values[el.value] = el.checked; });
  this.props.valueChange(name, values);
}
export function makeCheckbox(item, vertical) {
  const { state } = this.props;
  const value = state.values.inputValues[item.itemName] || {};
  return findChoices(state, item.id).map((choice, i) => {
    return (
      <label key={item.id + i} className={vertical ? 'vertical' : ''}>
        <input id={choice.id} type="checkbox" name={item.itemName} value={choice.value} onChange={this.handleCheckboxChange.bind(this)} checked={value[choice.value]}/>
        {choice.label}
      </label>
    );
  });
}

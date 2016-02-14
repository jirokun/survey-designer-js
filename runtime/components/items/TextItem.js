import React, { Component, PropTypes } from 'react'

export function handleTextChange(e) {
  const { name, value } = e.target;
  this.props.valueChange(name, value);
}
export function makeText(item) {
  const { state } = this.props;
  const { itemName, itemTitle } = item;
  const value = state.values.inputValues[itemName];
  return <input type="text" name={itemName} onChange={this.handleTextChange.bind(this)} value={value}/>;
}

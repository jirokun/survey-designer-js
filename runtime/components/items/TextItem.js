import React, { Component, PropTypes } from 'react'

export default class TextItem extends Component {
  handleChange(e) {
    this.props.valueChange(this.props.item.itemName, e.target.value);
  }
  render() {
    const { item, state } = this.props;
    const { itemName, itemTitle } = item;
    const value = state.values.inputValues[itemName];
    return (
      <div>
        <h3>{itemTitle}</h3>
        <label>
          <input type="text" name={itemName} onChange={this.handleChange.bind(this)} value={value}/>
        </label>
      </div>
    );
  }
}

TextItem.propTypes = {
};

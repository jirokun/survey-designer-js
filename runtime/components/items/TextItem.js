import React, { Component, PropTypes } from 'react'

export default class TextItem extends Component {
  handleChange(e) {
    this.props.valueChange(this.props.itemName, e.target.value);
  }
  render() {
    const { itemTitle, itemName, choices, state } = this.props;
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
  itemTitle: PropTypes.string,
  itemName: PropTypes.string,
};

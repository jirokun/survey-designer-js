import React, { Component, PropTypes } from 'react'

export default class CheckboxItem extends Component {
  makeCheckbox(itemName, choices) {
    return choices.map((choice) => {
      return (
        <label>
          <input type="checkbox" name={itemName} value={choice.value}/>
          {choice.label}
        </label>
      );
    });
  }
  render() {
    const { itemTitle, itemName, choices } = this.props;
    return (
      <div>
        <h3>{itemTitle}</h3>
        {this.makeCheckbox(itemName, choices)}
      </div>
    );
  }
}

CheckboxItem.propTypes = {
  itemTitle: PropTypes.string,
  itemName: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired
};

import React, { Component, PropTypes } from 'react'

export default class RadioItem extends Component {
  makeRadio(itemName, choices) {
    return choices.map((choice) => {
      return (
        <label key={choice.id}>
          <input type="radio" name={itemName} value={choice.value}/>
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
        {this.makeRadio(itemName, choices)}
      </div>
    );
  }
}

RadioItem.propTypes = {
  itemTitle: PropTypes.string,
  itemName: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired
};

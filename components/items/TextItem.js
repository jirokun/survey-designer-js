import React, { Component, PropTypes } from 'react'

export default class TextItem extends Component {
  makeText(itemName, choices) {
    return choices.map((choice) => {
      return (
        <label>
          <input type="text" name={itemName}/>
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
        <label>
          <input type="text" name={itemName}/>
        </label>
      </div>
    );
  }
}

TextItem.propTypes = {
  itemTitle: PropTypes.string,
  itemName: PropTypes.string,
};

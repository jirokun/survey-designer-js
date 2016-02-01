import React, { Component, PropTypes } from 'react'

export default class CheckboxItem extends Component {
  handleChange(e) {
    var els = this.refs.container.querySelectorAll('input');
    var values = {};

    Array.prototype.forEach.call(els, (el) => { values[el.value] = el.checked; });
    this.props.valueChange(this.props.itemName, values);
  }
  makeCheckbox(itemName, choices) {
    const value = this.props.state.values.inputValues[itemName] || {};
    return choices.map((choice) => {
      return (
        <label key={choice.id}>
          <input id={choice.id} type="checkbox" name={itemName} value={choice.value} onChange={this.handleChange.bind(this)} checked={value[choice.value]}/>
          {choice.label}
        </label>
      );
    });
  }
  render() {
    const { state, itemTitle, itemName, choices } = this.props;
    return (
      <div ref="container">
        <h3>{itemTitle}</h3>
        {this.makeCheckbox(itemName, choices)}
      </div>
    );
  }
}

CheckboxItem.propTypes = {
  id: PropTypes.string.isRequired,
  itemTitle: PropTypes.string,
  itemName: PropTypes.string,
  choices: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired
};

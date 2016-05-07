import React, { Component, PropTypes } from 'react'
import { errorMessage, isString, r } from '../../../utils'

export default class SelectQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeOptions() {
    const { id, choices, vertical, inputValues } = this.props;
    if (!choices) {
      return errorMessage('choices attribute is not defined');
    }
    const style = { marginBottom: 16 };
    return choices.map((label, i) => {
      const obj = { label: '', value: i + 1 };
      if (isString(label)) {
        obj.label = label;
      } else {
        Object.assign(obj, label);
      }
      return <option value={obj.value}>{obj.label}</option>;
    });
  }
  render() {
    const { multiple, id } = this.props;
    return (
      <div className={this.constructor.name}>
        <select name={id} multiple={multiple}>
          <option />
          {this.makeOptions()}
        </select>
      </div>
    );
  }
}

SelectQuestion.defaultProps = {
  multiple: false
};
SelectQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

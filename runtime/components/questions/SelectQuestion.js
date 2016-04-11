import React, { Component, PropTypes } from 'react'
import { errorMessage } from '../../../utils'

export default class SelectQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeOptions() {
    const { labels, values } = this.props;
    if (!labels) {
      return errorMessage('labels attribute is not defined');
    }
    return labels.map((label, i) => <option value={values && values[i] ? values[i] : i + 1}>{label}</option>);
  }
  render() {
    const { multiple } = this.props;
    return (
      <div className={this.constructor.name}>
        <select multiple={multiple}>
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
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

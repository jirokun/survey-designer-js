import React, { Component, PropTypes } from 'react';
import { errorMessage } from '../../../utils';

export default class InvalidTypeQuestion extends Component {
  render() {
    return errorMessage(`Invalid Question Type: ${this.props.type}`);
  }
}

InvalidTypeQuestion.defaultProps = {
};

InvalidTypeQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

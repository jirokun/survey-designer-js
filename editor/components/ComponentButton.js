import React, { Component, PropTypes } from 'react'
import * as Utils from '../../utils'

export default class ComponentButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { label } = this.props;
    return (
      <button className="btn btn-info btn-block component-button">
        <span>{label}</span>
      </button>
    );
  }
}

ComponentButton.defaultProps = {
};

ComponentButton.propTypes = {
};

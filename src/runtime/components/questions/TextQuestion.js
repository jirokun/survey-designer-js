import React, { Component, PropTypes } from 'react';

export default class TextQuestion extends Component {
  render() {
    return (
      <div className={this.constructor.name}>
        <input type="text" />
      </div>
    );
  }
}

TextQuestion.defaultProps = {
};

TextQuestion.propTypes = {
  type: PropTypes.string.isRequired,
};

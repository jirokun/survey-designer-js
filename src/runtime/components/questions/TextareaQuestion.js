import React, { Component, PropTypes } from 'react';

export default class TextareaQuestion extends Component {
  render() {
    return (
      <div className={this.constructor.name}>
        <textarea />
      </div>
    );
  }
}

TextareaQuestion.defaultProps = {
};

TextareaQuestion.propTypes = {
  type: PropTypes.string.isRequired,
};

import React, { Component, PropTypes } from 'react'

export default class InvalidTypeQuestion extends Component {
  render() {
    return (
      <h3 style={{color: 'red', background: '#fcc', border: '2px solid #f33'}}>
        Invalid Question Type: {this.props.type}
      </h3>
    );
  }
}

InvalidTypeQuestion.defaultProps = {
};

InvalidTypeQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

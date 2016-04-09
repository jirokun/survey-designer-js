import React, { Component, PropTypes } from 'react'

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeItems() {
    const { labels, values, vertical } = this.props;
    const labelClassName = vertical ? 'vertical' : 'horizontal';
    return labels.map((label, i) => <label className={labelClassName}><input type="checkbox"/> {label}</label>);
  }
  render() {
    return (
      <div>
        {this.makeItems()}
      </div>
    );
  }
}

CheckboxQuestion.defaultProps = {
  vertical: true
};

CheckboxQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

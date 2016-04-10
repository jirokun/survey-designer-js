import React, { Component, PropTypes } from 'react'

export default class RadioQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeItems() {
    const { labels, values, vertical } = this.props;
    const labelClassName = vertical ? 'vertical' : 'horizontal';
    return labels.map((label, i) => <label className={labelClassName}><input type="radio" value={values && values[i] ? values[i] : i + 1}/> {label}</label>);
  }
  render() {
    return (
      <div className={this.constructor.name}>
        {this.makeItems()}
      </div>
    );
  }
}

RadioQuestion.defaultProps = {
  values: [],
  vertical: true
};

RadioQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/lib/checkbox'
import { errorMessage } from '../../../utils'

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeItems() {
    const { labels, values, vertical } = this.props;
    if (!labels) {
      return errorMessage('labels attribute is not defined');
    }
    const labelClassName = vertical ? 'vertical' : 'horizontal';
    const style = { marginBottom: 16 };
    return labels.map((label, i) => <Checkbox label={label} style={style} className={labelClassName} value={values && values[i] ? values[i] : i + 1}/>);
  }
  render() {
    return (
      <div className={this.constructor.name}>
        {this.makeItems()}
      </div>
    );
  }
}

CheckboxQuestion.defaultProps = {
  values: [],
  vertical: true
};

CheckboxQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

import React, { Component, PropTypes } from 'react'
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RadioButton from 'material-ui/lib/radio-button'
import { errorMessage } from '../../../utils'

export default class RadioQuestion extends Component {
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
    return labels.map((label, i) => <RadioButton label="Simple" style={style} className={labelClassName} value={values && values[i] ? values[i] : i + 1}/>);
  }
  render() {
    return (
      <div className={this.constructor.name}>
        <RadioButtonGroup name="hoge">
          {this.makeItems()}
        </RadioButtonGroup>
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

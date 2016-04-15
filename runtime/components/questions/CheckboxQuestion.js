import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/lib/checkbox'
import * as Utils from '../../../utils'

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeItems() {
    const { choices, vertical } = this.props;
    if (!choices) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    const labelClassName = `checkbox-label ${vertical ? 'vertical' : 'horizontal'}`;
    const style = { marginBottom: 16 };
    return choices.map((label, i) => {
      const obj = { label: '', value: i + 1 };
      if (Utils.isString(label)) {
        obj.label = label;
      } else {
        Object.assign(obj, label);
      }
      return <label className={labelClassName}>
        <input type="checkbox" value={obj.value}/>
        <span dangerouslySetInnerHTML={{__html: obj.label}}/>
      </label>;
    });
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
  choices: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

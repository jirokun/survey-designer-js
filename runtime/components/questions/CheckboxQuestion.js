import React, { Component, PropTypes } from 'react'
import { errorMessage, isString, r } from '../../../utils'

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
  }
  makeItems() {
    const { id, page, choices, vertical, inputValues } = this.props;
    if (!choices) {
      return errorMessage('choices attribute is not defined');
    }
    const labelClassName = `checkbox-label ${vertical ? 'vertical' : 'horizontal'}`;
    const style = { marginBottom: 16 };
    return choices.map((label, i) => {
      const obj = { label: '', value: i + 1 };
      if (isString(label)) {
        obj.label = label;
      } else {
        Object.assign(obj, label);
      }
      return <label key={id + i} className={labelClassName}>
        <input type="checkbox" name={`${page.id}_${id}`} value={obj.value}/>
        <span dangerouslySetInnerHTML={{__html: r(obj.label, inputValues)}}/>
      </label>;
    });
  }
  render() {
    const { title, beforeNote, afterNote, inputValues } = this.props;
    return (
      <div className={this.constructor.name}>
        <h3 className="question-title" dangerouslySetInnerHTML={{__html: r(title, inputValues)}} />
        <div className="beforeNote" dangerouslySetInnerHTML={{__html: r(beforeNote, inputValues)}} />
        <div className="choices">
          {this.makeItems()}
        </div>
        <div className="beforeNote" dangerouslySetInnerHTML={{__html: r(afterNote, inputValues)}} />
      </div>
    );
  }
}

CheckboxQuestion.defaultProps = {
  inputValues: [],
  vertical: true
};

CheckboxQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

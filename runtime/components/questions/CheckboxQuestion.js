import React, { Component, PropTypes } from 'react';
import * as Utils from '../../../utils';

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
    };
  }
  handleChange(i, e) {
    const checkboxDiv = Utils.findParentByClassName(e.target, 'checkbox');
    const freeInputEl = checkboxDiv.querySelector('.free-input');
    if (!freeInputEl) {
      return;
    }
    const newState = Utils.cloneObj(this.state);
    newState.checkedList[i] = e.target.checked;
    this.setState(newState);
  }
  freeInput(opts, checked) {
    if (!opts.freeInput) return null;
    const { id, page, choices, vertical, inputValues } = this.props;
    return <input className="free-input" type="text" name={`${page.id}_${id}_${opts.value}_free`} disabled={!checked} />;
  }
  makeItems() {
    const { id, page, choices, vertical, inputValues } = this.props;
    if (!choices) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    const labelClassName = `checkbox ${vertical ? 'vertical' : 'horizontal'}`;
    const style = { marginBottom: 16 };
    const checkedList = this.state.checkedList;
    return choices.map((label, i) => {
      const opts = { label: '', value: i + 1 };
      if (Utils.isString(label)) {
        opts.label = label;
      } else {
        Object.assign(opts, label);
      }
      return (<div className={labelClassName}>
        <label key={id + i}>
          <input type="checkbox" name={`${page.id}_${id}`} value={opts.value} onChange={this.handleChange.bind(this, i)} />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(opts.label, inputValues) }} />
        </label>
        {this.freeInput(opts, checkedList[i])}
      </div>);
    });
  }
  render() {
    const { title, beforeNote, afterNote, inputValues } = this.props;
    return (
      <div className={this.constructor.name}>
        <h3 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <div className="beforeNote" dangerouslySetInnerHTML={{ __html: Utils.r(beforeNote, inputValues) }} />
        <div className="choices">
          {this.makeItems()}
        </div>
        <div className="beforeNote" dangerouslySetInnerHTML={{ __html: Utils.r(afterNote, inputValues) }} />
      </div>
    );
  }
}

CheckboxQuestion.defaultProps = {
  inputValues: [],
  vertical: true,
};

CheckboxQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  vertical: PropTypes.bool.isRequired,
};

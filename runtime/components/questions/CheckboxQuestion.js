import React, { Component, PropTypes } from 'react'
import * as Utils from '../../../utils'

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: []
    };
  }
  handleChange(e) {
    const checkboxDiv = Utils.findParentByClassName(e.target, 'checkbox');
    const freeInputEl = checkboxDiv.querySelector('.free-input');
    if (!freeInputEl) {
      return;
    }
    freeInputEl.disabled = e.target.checked;
    // TODO stateを使った変更監視にするべき
  }
  freeInput(opts) {
    if (!opts.freeInput) return null;
    return <input className="free-input" type="text"/>
  }
  makeItems() {
    const { id, page, choices, vertical, inputValues } = this.props;
    if (!choices) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    const labelClassName = `checkbox ${vertical ? 'vertical' : 'horizontal'}`;
    const style = { marginBottom: 16 };
    return choices.map((label, i) => {
      const opts = { label: '', value: i + 1 };
      if (Utils.isString(label)) {
        opts.label = label;
      } else {
        Object.assign(opts, label);
      }
      return <div className={labelClassName}>
        <label key={id + i}>
          <input type="checkbox" name={`${page.id}_${id}`} value={opts.value} onChange={this.handleChange.bind(this)}/>
          <span dangerouslySetInnerHTML={{__html: Utils.r(opts.label, inputValues)}}/>
        </label>
        {this.freeInput(opts)}
      </div>;
    });
  }
  render() {
    const { title, beforeNote, afterNote, inputValues } = this.props;
    return (
      <div className={this.constructor.name}>
        <h3 className="question-title" dangerouslySetInnerHTML={{__html: Utils.r(title, inputValues)}} />
        <div className="beforeNote" dangerouslySetInnerHTML={{__html: Utils.r(beforeNote, inputValues)}} />
        <div className="choices">
          {this.makeItems()}
        </div>
        <div className="beforeNote" dangerouslySetInnerHTML={{__html: Utils.r(afterNote, inputValues)}} />
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

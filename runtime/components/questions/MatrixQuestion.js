import React, { Component, PropTypes } from 'react'
import * as Utils from '../../../utils'

export default class MatrixQuestion extends Component {
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
  renderhHeader() {
    const { vChoices, hChoices } = this.props;
    return <thead><tr><td/>{hChoices.map(c => <td>{c}</td>)}</tr></thead>;
  }
  renderBody() {
    const { vChoices, hChoices } = this.props;
    return <tbody>
      {vChoices.map(v => (
        <tr>
          <td>{v}</td>
          {hChoices.map(h => <td><input type="checkbox"/></td>)}
        </tr>
      ))}
      </tbody>;
  }
  render() {
    const { vChoices, hChoices } = this.props;
    return (
      <div className={this.constructor.name}>
        <table>
          {this.renderhHeader()}
          {this.renderBody()}
        </table>
      </div>
    );
  }
}

MatrixQuestion.defaultProps = {
  values: [],
  vertical: true
};

MatrixQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  vChoices: PropTypes.array.isRequired,
  hChoices: PropTypes.array.isRequired,
};

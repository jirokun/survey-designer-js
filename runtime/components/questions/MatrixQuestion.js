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
      if (label === null || Utils.isString(label)) {
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
  isHorizontal() {
    const { direction } = this.props;
    if (direction === 'horizontal') {
      return true;
    } else if (direction === 'vertical') {
      return false;
    } else {
      throw 'illegal direction: ' + direction;
    }
  }
  renderhHeader() {
    const { questions, values, direction } = this.props;
    const labels = this.isHorizontal() ? values : questions;
    return <thead><tr><td/>{labels.map(c => {
      if (c === null || Utils.isString(c)) {
        return <td dangerouslySetInnerHTML={{__html: c}}/>;
      } else {
        return <td dangerouslySetInnerHTML={{__html: c.label}}/>;
      }
    })}</tr></thead>;
  }
  renderCell(index) {
    const { cellType, id } = this.props;
    const name = `${id}-${index + 1}`;
    switch (cellType) {
      case 'checkbox':
        return <input type="checkbox" name={name}/>;
      case 'radio':
        return <input type="radio" name={name}/>;
      case 'text':
        return <input type="text" name={name}/>;
      case 'textarea':
        return <textarea name={name}/>;
      default:
        throw 'unknown cellType: ' + cellType;
    }
  }
  renderBody() {
    const { questions, values, direction, cellType } = this.props;
    const rowLabels = this.isHorizontal() ? questions : values;
    const columnLabels = this.isHorizontal() ? values : questions;
    return <tbody>
      {rowLabels.map((v, vIndex) => {
        let prefix = '', postfix = '', label = '';
        if (!this.isHorizontal() && !Utils.isString(v)) {
          prefix = v.prefix ? <span className="prefix" dangerouslySetInnerHTML={{__html: v.prefix}}/> : '';
          postfix = v.postfix ? <span className="postfix" dangerouslySetInnerHTML={{__html: v.postfix}}/> : '';
          label = v.label;
        } else {
          label = v;
        }
        return (
          <tr>
            <td dangerouslySetInnerHTML={{__html: label}}/>
            {columnLabels.map((h, hIndex) => {
              if (this.isHorizontal() && (h !== null && !Utils.isString(h))) {
                prefix = h.prefix ? <span className="prefix" dangerouslySetInnerHTML={{__html: h.prefix}}/> : '';
                postfix = h.postfix ? <span className="postfix" dangerouslySetInnerHTML={{__html: h.postfix}}/> : '';
              } else {
                prefix = '';
                postfix = '';
              }
              return <td>{prefix}{this.renderCell(this.isHorizontal() ? vIndex : hIndex)}{postfix}</td>
            })}
          </tr>
        );
      })}
      </tbody>;
  }
  render() {
    const { questions, values, direction, cellType } = this.props;
    if (!questions) {
      return Utils.errorMessage('questions attribute is not defined');
    }
    if (!values) {
      return Utils.errorMessage('values attribute is not defined');
    }
    if (!(direction === 'horizontal' || direction === 'vertical')) {
      return Utils.errorMessage(`direction attribute must be 'horizontal' or 'vertical'`);
    }
    const cellTypes = ['checkbox', 'radio', 'text', 'textarea'];
    if (!cellTypes.includes(cellType)) {
      return Utils.errorMessage(`cellType attribute must be {cellTypes.join(' or ')}`);
    }
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
  cellType: 'radio',
  direction: 'horizontal'
};

MatrixQuestion.propTypes = {
  type: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
};

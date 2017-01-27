import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Utils from '../../../utils';

export class CheckboxQuestion extends Component {
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
    const { id, page } = this.props;
    return <input className="free-input" type="text" name={`${page.id}_${id}_${opts.value}_free`} disabled={!checked} />;
  }

  makeItems() {
    const { id, page, question } = this.props;
    const choices = question.getChoices();
    const vertical = question.isVertical();
    const inputValues = {};
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    const labelClassName = `checkbox ${vertical ? 'vertical' : 'horizontal'}`;
    const checkedList = this.state.checkedList;
    return choices.map((choice, i) => {
      const label = choice.getLabel();
      const opts = { label, value: i + 1 };
      return (
        <div className={labelClassName} key={id + i}>
          <label>
            <input type="checkbox" name={`${page.id}_${id}`} value={opts.value} onChange={(e) => this.handleChange(i, e)} />
            <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          </label>
          {this.freeInput(opts, checkedList[i])}
        </div>
      );
    });
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const beforeNote = question.getBeforeNote();
    const inputValues = {};
    return (
      <div className={this.constructor.name}>
        <h3 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <div className="beforeNote" dangerouslySetInnerHTML={{ __html: Utils.r(beforeNote, inputValues) }} />
        <div className="choices">
          {this.makeItems()}
        </div>
      </div>
    );
  }
}

CheckboxQuestion.defaultProps = {
  question: [],
  vertical: true,
};

CheckboxQuestion.propTypes = {
};

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  valueChange: (itemName, value) => dispatch(valueChange(itemName, value)),
  prevPage: () => dispatch(prevPage()),
  nextPage: () => dispatch(nextPage()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(CheckboxQuestion);

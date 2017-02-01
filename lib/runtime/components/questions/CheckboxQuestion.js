import React, { Component } from 'react';
import { List } from 'immutable';
import * as Utils from '../../../utils';

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedState: List(),
    };
  }

  makeItems() {
    const { id, question } = this.props;
    const choices = question.getTransformedChoices();
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map((choice, i) => <Choice key={`${question.getId()}${choice.getIndex()}`} id={id} question={question} choice={choice} index={i} />);
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const beforeNote = question.getBeforeNote();
    const inputValues = {};
    return (
      <div className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(beforeNote, inputValues) }} />
        <div className="question">
          <ul className="checkbox validation-hover-target">
            {this.makeItems()}
          </ul>
        </div>
      </div>
    );
  }
}

class Choice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  handleCheckboxChange(e) {
    this.setState({ checked: e.target.checked });
  }

  renderInput(question, choice) {
    let type;
    if (choice.hasTextInput()) type = 'text';
    else if (choice.hasNumberInput()) type = 'text';
    else return null;
    return (
      <input
        type={type}
        name={question.getId()}
        data-key="freeText"
        data-choice-index={choice.getIndex()}
        disabled={!this.state.checked}
        className={!this.state.checked ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { id, choice, index, question } = this.props;
    const label = choice.getLabel();
    const unit = choice.getUnit();
    const inputValues = {};
    return (
      <li className="question-form-list" key={`${id}${index}`}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type="checkbox"
            name={question.getId()}
            value="on"
            onChange={e => this.handleCheckboxChange(e)}
            data-key="checked"
            data-choice-index={choice.getIndex()}
          />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          {this.renderInput(question, choice)}
          <span dangerouslySetInnerHTML={{ __html: Utils.r(unit, inputValues) }} />
        </label>
      </li>
    );
  }
}

CheckboxQuestion.defaultProps = {
  question: [],
  vertical: true,
};

CheckboxQuestion.propTypes = {
};

import React, { Component } from 'react';
import * as Utils from '../../../utils';

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
    // stateが変わるたびに順序が異なると困るのでchoicesをtransformしておく
    this.transformedChoices = props.question.getTransformedChoices();
    this.state = {
      checkedState: [],
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみchoicesをtransformしておく
      this.transformedChoices = this.props.question.getTransformedChoices();
    }
  }

  handleCheckboxChange(e) {
    const { question } = this.props;
    const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
    const choices = question.getChoices();
    const choice = choices.get(choiceIndex);
    let checkedState;
    if (e.target.checked && choice.isExclusive()) {
      checkedState = choices.map(() => false).toArray();
      checkedState[choiceIndex] = true;
      this.setState({ checkedState });
      return;
    }
    checkedState = Array.prototype.slice.call(this.rootEl.querySelectorAll('input.question-form-list-input'))
      .sort((a, b) => {
        if (a.dataset.choiceIndex < b.dataset.choiceIndex) return -1;
        if (a.dataset.choiceIndex === b.dataset.choiceIndex) return 0;
        return 1;
      })
      .map(el => el.checked);
    this.setState({ checkedState });
  }

  makeItems() {
    const { question } = this.props;
    const choices = this.transformedChoices;
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map(choice => (
      <Choice
        key={`${question.getId()}_${choice.getIndex()}`}
        question={question}
        choice={choice}
        checked={this.state.checkedState[choice.getIndex()]}
        handleCheckboxChange={e => this.handleCheckboxChange(e)}
      />
    ));
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const beforeNote = question.getBeforeNote();
    const inputValues = {};
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
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
        disabled={this.props.disabled}
        className={this.props.disabled ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { checked, choice, question, disabled, handleCheckboxChange } = this.props;
    const label = choice.getLabel();
    const unit = choice.getUnit();
    const inputValues = {};
    const className = `question-form-list ${disabled ? 'disabled' : ''}`;
    return (
      <li className={className}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type="checkbox"
            name={question.getId()}
            value="on"
            checked={checked}
            onChange={handleCheckboxChange}
            data-key="checked"
            data-choice-index={choice.getIndex()}
            disabled={disabled}
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

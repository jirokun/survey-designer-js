import React, { Component } from 'react';
import { Map } from 'immutable';
import * as Utils from '../../../utils';

const DEFAULT_CHECKBOX_STATE = { checked: false, disabled: false };

export default class ChoiceBase extends Component {
  constructor(props, inputType, Model) {
    super(props);
    this.inputType = inputType;
    this.Model = Model;
    const transformedChoices = props.question.getTransformedChoices();
    const checkboxState = transformedChoices.map(() => Map(DEFAULT_CHECKBOX_STATE)).toList();
    this.state = {
      // stateが変わるたびに順序が異なると困るのでchoicesをtransformしておく
      model: new this.Model({ transformedChoices, checkboxState }),
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      const transformedChoices = nextProps.question.getTransformedChoices();
      const checkboxState = transformedChoices.map(() => Map(DEFAULT_CHECKBOX_STATE)).toList();
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみchoicesをtransformしておく
      this.setState({
        model: new this.Model({ transformedChoices, checkboxState }),
      });
    }
  }

  handleCheckboxChange(e) {
    const { model } = this.state;
    const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
    console.log(e);
    this.setState({ model: model.setCheckboxState(choiceIndex, e.target.checked) });
  }

  makeItems() {
    const { question } = this.props;
    const { model } = this.state;
    const choices = model.getTransformedChoices();
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map(choice => (
      <Choice
        key={`${question.getId()}_${choice.getIndex()}`}
        question={question}
        inputType={this.inputType}
        choice={choice}
        checkboxState={model.getCheckboxStateByChoiceIndex(choice.getIndex())}
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
  renderInput(question, choice, checkboxState) {
    let type;
    if (choice.hasTextInput()) type = 'text';
    else if (choice.hasNumberInput()) type = 'text';
    else return null;
    const disabled = !checkboxState.get('checked');
    return (
      <input
        type={type}
        name={question.getId()}
        data-key="freeText"
        data-choice-index={choice.getIndex()}
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { checkboxState, inputType, choice, question, handleCheckboxChange } = this.props;
    const label = choice.getLabel();
    const unit = choice.getUnit();
    const inputValues = {};
    const disabled = !!checkboxState.get('disabled');
    const className = `question-form-list ${disabled ? 'disabled' : ''}`;
    return (
      <li className={className}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type={inputType}
            name={question.getId()}
            value="on"
            checked={checkboxState.get('checked')}
            onChange={handleCheckboxChange}
            data-key="checked"
            data-choice-index={choice.getIndex()}
            disabled={disabled}
          />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          {this.renderInput(question, choice, checkboxState)}
          <span dangerouslySetInnerHTML={{ __html: Utils.r(unit, inputValues) }} />
        </label>
      </li>
    );
  }
}

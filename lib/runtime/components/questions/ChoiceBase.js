import React, { Component } from 'react';
import * as Utils from '../../../utils';
import TransformQuestion from './TransformQuestion';

export default class ChoiceBase extends TransformQuestion {
  handleCheckboxChange(e) {
    const { model } = this.state;
    const choiceIndex = parseInt(e.target.dataset.choiceIndex, 10);
    this.setState({ model: model.setItemState(choiceIndex, e.target.checked) });
  }

  makeItems(containerId) {
    const { question } = this.props;
    const { model } = this.state;
    const choices = model.getTransformedChoices();
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map(choice => (
      <Choice
        key={`${question.getId()}_${choice.getIndex()}`}
        containerId={containerId}
        question={question}
        inputType={this.inputType}
        choice={choice}
        itemState={model.getItemStateByChoiceIndex(choice.getIndex())}
        handleCheckboxChange={e => this.handleCheckboxChange(e)}
      />
    ));
  }

  render() {
    const { question } = this.props;
    const title = question.getTitle();
    const beforeNote = question.getBeforeNote();
    const inputValues = {};
    const containerId = `${question.getId()}-ul-container`;
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(beforeNote, inputValues) }} />
        <div className="question">
          <ul id={containerId} className="checkbox validation-hover-target">
            {this.makeItems(containerId)}
          </ul>
        </div>
      </div>
    );
  }
}

class Choice extends Component {
  renderInput(question, choice, itemState) {
    let type;
    if (choice.hasTextInput()) type = 'text';
    else if (choice.hasNumberInput()) type = 'number';
    else return null;
    const disabled = !itemState.get('checked');
    return (
      <input
        type={type}
        name={question.getId()}
        data-key="freeText"
        data-parsley-required
        data-parsley-type={type === 'number' ? 'digits' : null}
        data-parsley-type-message="半角数字のみで入力してください"
        data-choice-index={choice.getIndex()}
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
        onClick={e => e.preventDefault()}
      />
    );
  }

  render() {
    const { containerId, itemState, inputType, choice, question, handleCheckboxChange } = this.props;
    const label = choice.getLabel();
    const unit = choice.getUnit();
    const inputValues = {};
    const disabled = !!itemState.get('disabled');
    const className = `question-form-list ${disabled ? 'disabled' : ''}`;
    return (
      <li className={className}>
        <label className="question-form-list-label">
          <input
            className="question-form-list-input"
            type={inputType}
            name={question.getId()}
            value="on"
            checked={itemState.get('checked')}
            onChange={handleCheckboxChange}
            data-key="checked"
            data-choice-index={choice.getIndex()}
            disabled={disabled}
            data-parsley-class-handler={`#${containerId}`}
            data-parsley-required={question.getMinCheckCount() > 0}
            data-parsley-mincheck={question.getMinCheckCount() !== 0 ? question.getMinCheckCount() : null}
            data-parsley-maxcheck={question.getMaxCheckCount() !== 0 ? question.getMaxCheckCount() : null}
          />
          <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          {this.renderInput(question, choice, itemState)}
          <span dangerouslySetInnerHTML={{ __html: Utils.r(unit, inputValues) }} />
        </label>
      </li>
    );
  }
}

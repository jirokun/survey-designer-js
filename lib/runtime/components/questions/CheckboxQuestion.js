import React, { Component } from 'react';
import * as Utils from '../../../utils';

export default class CheckboxQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleCheckboxChange(e) {
  }

  makeItems() {
    const { id, question } = this.props;
    const choices = question.getTransformedChoices();
    const inputValues = {};
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map((choice, i) => {
      const label = choice.getLabel();
      const unit = choice.getUnit();
      return (
        <li className="question-form-list" key={`${id}${i}`}>
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
    });
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
      />
    );
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

CheckboxQuestion.defaultProps = {
  question: [],
  vertical: true,
};

CheckboxQuestion.propTypes = {
};

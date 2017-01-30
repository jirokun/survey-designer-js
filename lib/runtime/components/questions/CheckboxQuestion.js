import React, { Component } from 'react';
import * as Utils from '../../../utils';

export default class CheckboxQuestion extends Component {
  makeItems() {
    const { id, page, question } = this.props;
    const choices = question.getTransformedChoices();
    const inputValues = {};
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map((choice, i) => {
      const label = choice.getLabel();
      return (
        <li className="question-form-list" key={`${id}${i}`}>
          <label className="question-form-list-label">
            <input className="question-form-list-input" type="checkbox" name={`${page.id}_${id}`} value={i} />
            <span dangerouslySetInnerHTML={{ __html: Utils.r(label, inputValues) }} />
          </label>
        </li>
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
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: Utils.r(title, inputValues) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: Utils.r(beforeNote, inputValues) }} />
        <div className="question">
          <ul className="checkbox">
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

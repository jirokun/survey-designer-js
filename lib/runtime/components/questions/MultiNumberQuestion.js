import React from 'react';
import * as Utils from '../../../utils';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../models/state/MultiNumberQuestionState';

export default class MultiNumberQuestion extends TransformQuestion {
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  makeItems() {
    const { question } = this.props;
    const { model } = this.state;
    const choices = model.getTransformedChoices();
    const inputValues = {};
    if (choices.size === 0) {
      return Utils.errorMessage('choices attribute is not defined');
    }
    return choices.map(choice => (
      <div key={`${question.getId()}_${choice.getIndex()}`} className="multiNumberLine">
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: Utils.r(choice.getLabel(), inputValues) }} />
        </div>
        <div className="multiNumberAssociated mini">
          <div className="multiNumberInput">
            <input type="text" maxLength="16" name={question.getId()} data-key="value" data-choice-index={choice.getIndex()} />
            <span className="multiNumberUnit"> mg</span>
          </div>
        </div>
      </div>
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
        <div className="question validation-hover-target">
          {this.makeItems()}
        </div>
      </div>
    );
  }
}

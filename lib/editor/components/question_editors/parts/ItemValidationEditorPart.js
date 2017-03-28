import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, InputGroup } from 'react-bootstrap';
import * as EditorActions from '../../../actions';
import ValueEditorPart from './ValueEditorPart';

class ItemValidationEditorPart extends Component {
  handleChangeItemValidation(item, value) {
    const { page, question, changeItemAttribute } = this.props;
    changeItemAttribute(page.getId(), question.getId(), item.getId(), 'totalEqualTo', value);
  }

  createValidatorForItem(item, index) {
    const { page, question, labelPostfix } = this.props;
    return (
      <li key={`${this.constructor.name}-${question.getId()}-${item.getId()}`}>
        <span>{index + 1} {labelPostfix}</span>
        <FormGroup>
          <InputGroup>
            <ValueEditorPart
              page={page}
              question={question}
              value={item.getTotalEqualTo()}
              onChange={value => this.handleChangeItemValidation(item, value)}
            />
            <InputGroup.Addon>になるように制限する</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </li>
    );
  }

  render() {
    const { items } = this.props;
    return (
      <ul className="item-validator-list">
        {items.map((item, i) => this.createValidatorForItem(item, i))}
      </ul>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
});
const actionsToProps = dispatch => ({
  changeItemAttribute: (pageId, questionId, itemId, attributeName, value) =>
    dispatch(EditorActions.changeItemAttribute(pageId, questionId, itemId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ItemValidationEditorPart);

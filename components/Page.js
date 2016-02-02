import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import RadioQuestion from '../components/questions/RadioQuestion'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import { findQuestion } from '../utils'

export default class Page extends Component {
  makeQuestions(state, questionIds) {
    const { actions } = this.props;
    return questionIds.map((questionId) => {
      return findQuestion(state, questionId);
    }).map((q) => {
      let component = (q.questionType === 'default') ? DefaultQuestion : null;
      if (component === null) throw 'invalid component';
      return React.createElement(component, {
        state: state,
        key: q.id,
        questionTitle: q.questionTitle,
        items: q.items,
        valueChange: actions.valueChange
      });
    });
  }
  render() {
    const { state, pageTitle, questionIds, actions } = this.props;
    return (
      <div>
        <h2>{pageTitle}</h2>
        {this.makeQuestions(state, questionIds)}
        <Footer handleBack={actions.prevPage} handleNext={actions.nextPage}/>
      </div>
    );
  }
}

Page.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

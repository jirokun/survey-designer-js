import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import RadioQuestion from '../components/questions/RadioQuestion'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import { findQuestion } from '../utils'

export default class Page extends Component {
  makeQuestions(state, questions) {
    return questions.map((questionId) => {
      return findQuestion(state, questionId);
    }).map((q) => {
      let component = (q.questionType === 'default') ? DefaultQuestion : null;
      if (component === null) throw 'invalid component';
      return React.createElement(component, {
        key: q.id,
        questionTitle: q.questionTitle,
        items: q.items
      });
    });
  }
  render() {
    const { state, pageTitle, questions } = this.props;
    return (
      <div>
        <h2>{pageTitle}</h2>
        {this.makeQuestions(state, questions)}
        <Footer/>
      </div>
    );
  }
}

Page.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

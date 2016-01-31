import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import RadioQuestion from '../components/questions/RadioQuestion'
import DefaultQuestion from '../components/questions/DefaultQuestion'

export default class Page extends Component {
  makeQuestions(questions) {
    return questions.map((q) => {
      let component = (q.questionType === 'default') ? DefaultQuestion : null;
      if (component === null) throw 'invalid component';
      return React.createElement(component, {
        key: q.key,
        questionTitle: q.questionTitle,
        items: q.items
      });
    });
  }
  render() {
    const { pageTitle, questions } = this.props;
    return (
      <div>
        <h2>{pageTitle}</h2>
        {this.makeQuestions(questions)}
        <Footer/>
      </div>
    );
  }
}

Page.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

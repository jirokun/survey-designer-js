import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import TableQuestion from '../components/questions/TableQuestion'
import { findQuestions } from '../../utils'

export default class Page extends Component {
  makeQuestions() {
    const { page, actions, state } = this.props;
    return findQuestions(state, page.id).map((q) => {
      let component;
      switch (q.questionType) {
        case 'default':
          component = DefaultQuestion;
          break;
        case 'table':
          component = TableQuestion;
          break;
        default:
          throw 'invalid component';
      }
      return React.createElement(component, {
        state: state,
        question: q,
        key: q.id,
        valueChange: actions.valueChange
      });
    });
  }
  render() {
    const { page, actions, state } = this.props;
    return (
      <div>
        <h2>{page.pageTitle}</h2>
        {this.makeQuestions()}
        <Footer state={state} handleBack={actions.prevPage} handleNext={actions.nextPage}/>
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired
};

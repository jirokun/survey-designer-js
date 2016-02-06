import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import RadioQuestion from '../components/questions/RadioQuestion'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import { findQuestions } from '../../utils'

export default class Page extends Component {
  makeQuestions() {
    const { page, actions, state } = this.props;
    return findQuestions(state, page.id).map((q) => {
      let component = (q.questionType === 'default') ? DefaultQuestion : null;
      if (component === null) throw 'invalid component';
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

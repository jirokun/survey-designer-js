import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import TableQuestion from '../components/questions/TableQuestion'
import { findQuestions, findCustomPage } from '../../utils'

class Page extends Component {
  makeQuestions() {
    const { page } = this.props;
    console.log(page);
    return null;
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
        question: q,
        key: q.id,
        valueChange: actions.valueChange
      });
    });
  }
  render() {
    const { page } = this.props;
    return (
      <div>
        <h2>{page.title}</h2>
        { this.makeQuestions() }
        <Footer />
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired
};

const stateToProps = state => ({
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(Page);

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import InvalidTypeQuestion from '../components/questions/InvalidTypeQuestion'
import TableQuestion from '../components/questions/TableQuestion'
import CheckboxQuestion from '../components/questions/CheckboxQuestion'
import { findQuestions, findCustomPage } from '../../utils'

class Page extends Component {
  makeQuestions() {
    const { page } = this.props;
    return page.questions.map((q) => {
      let component;
      switch(q.type) {
        case 'checkbox':
          component = CheckboxQuestion;
          break;
        default:
          component = InvalidTypeQuestion;
          break;
      }
      return React.createElement(component, {
        ...q
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

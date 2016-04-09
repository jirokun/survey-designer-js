import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import DefaultQuestion from '../components/questions/DefaultQuestion'
import TableQuestion from '../components/questions/TableQuestion'
import CheckboxQuestion from '../components/questions/CheckboxQuestion'
import { findQuestions, findCustomPage } from '../../utils'

class Page extends Component {
  makeQuestions() {
    const { page } = this.props;
    return page.questions.map((q) => {
      let component;
      console.log(q);
      switch(q.type) {
        case 'checkbox':
          component = CheckboxQuestion;
          break;
        default:
          throw 'invalid component';
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

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import Footer from '../components/Footer'
import InvalidTypeQuestion from '../components/questions/InvalidTypeQuestion'
import TextQuestion from '../components/questions/TextQuestion'
import TextareaQuestion from '../components/questions/TextareaQuestion'
import CheckboxQuestion from '../components/questions/CheckboxQuestion'
import RadioQuestion from '../components/questions/RadioQuestion'
import SelectQuestion from '../components/questions/SelectQuestion'
import { findQuestions, findCustomPage } from '../../utils'

class Page extends Component {
  makeQuestions() {
    const { page } = this.props;
    return page.questions.map((q) => {
      let component;
      switch(q.type) {
        case 'text':
          component = TextQuestion;
          break;
        case 'textarea':
          component = TextareaQuestion;
          break;
        case 'checkbox':
          component = CheckboxQuestion;
          break;
        case 'radio':
          component = RadioQuestion;
          break;
        case 'select':
          component = SelectQuestion;
          break;
        default:
          component = InvalidTypeQuestion;
          break;
      }
      return <div className="question">{ React.createElement(component, { ...q }) }</div>
    });
  }
  render() {
    const { page } = this.props;
    return (
      <div className="page">
        <h2 className="page-title">{page.title}</h2>
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

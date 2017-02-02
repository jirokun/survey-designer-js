import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';

class EnqueteRuntimeApp extends Component {
  render() {
    const { state } = this.props;
    const currentPage = state.findCurrentPage();
    if (!currentPage) {
      return <div>undefined page</div>;
    }
    return (
      <div>
        <div id="content">
          <div id="surveyBox">
            <h1>タイトル</h1>
          </div>
          <div className="questionsEditBox">
            <Page page={currentPage} />
          </div>
        </div>
      </div>
    );
  }
}

EnqueteRuntimeApp.propTypes = {
};

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteRuntimeApp);

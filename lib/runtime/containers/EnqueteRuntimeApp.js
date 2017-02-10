import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import Finisher from '../components/Finisher';

class EnqueteRuntimeApp extends Component {
  renderNode() {
    const { state } = this.props;
    const currentNode = state.findCurrentNode();

    if (currentNode.isPage()) {
      return <Page page={state.findCurrentPage()} />;
    } else if (currentNode.isBranch()) {
      return <div>分岐は表示できません</div>;
    } else if (currentNode.isFinisher()) {
      return <Finisher finisher={state.findCurrentFinisher()} />;
    }
    throw new Error(`不明なnodeTypeです。type: ${currentNode.getType()}`);
  }

  render() {
    return (
      <div>
        <div id="content">
          <div id="surveyBox">
            <h1>タイトル</h1>
          </div>
          <div className="questionsEditBox">
            {this.renderNode()}
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

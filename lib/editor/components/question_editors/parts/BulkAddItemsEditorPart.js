/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as EditorActions from '../../../actions';

class BulkAddItemsEditorPart extends Component {
  constructor(props) {
    super(props);
    this.state = { inputText: '' };
  }

  handleBulkAddItems() {
    const { bulkAddItems, handleExecute, page, question } = this.props;
    bulkAddItems(page.getId(), question.getId(), this.state.inputText);
    handleExecute();
  }

  render() {
    return (
      <div>
        <div>1行に1項目を指定してください。HTMLも指定可能です。</div>
        <div><textarea className="item-bulk-add-editor" value={this.state.inputText} onChange={e => this.setState({ inputText: e.target.value })} /></div>
        <div className="clearfix"><button type="button" className="btn btn-primary pull-right" onClick={() => this.handleBulkAddItems()}>一括追加</button></div>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});
const actionsToProps = dispatch => ({
  bulkAddItems: (pageId, questionId, text) => dispatch(EditorActions.bulkAddItems(pageId, questionId, text)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BulkAddItemsEditorPart);

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import S from 'string';
import * as EditorActions from '../../../actions';

class BulkAddItemsEditorPart extends Component {
  constructor(props) {
    super(props);
    this.state = { inputText: '' };
  }

  /** 一括追加を実行する */
  handleBulkAddItems() {
    const { bulkAddItems, handleExecute, page, question } = this.props;
    bulkAddItems(page.getId(), question.getId(), this.state.inputText);
    handleExecute();
  }

  /** タブを改行に置換する */
  handleClickConvertTabToLineBreak() {
    const replacedStr = this.state.inputText.replace(/\t/g, '\n');
    this.setState({ inputText: replacedStr });
  }

  /** 空行を削除する */
  handleClickDeleteEmptyLines() {
    const lines = this.state.inputText.split(/\n/);
    const replacedStr = lines.filter(line => !S(line).isEmpty()).join('\n');
    this.setState({ inputText: replacedStr });
  }

  render() {
    return (
      <div>
        <div>1行に1項目を指定してください。HTMLも指定可能です。</div>
        <div><textarea className="item-bulk-add-editor" value={this.state.inputText} onChange={e => this.setState({ inputText: e.target.value })} /></div>
        <div className="clearfix">
          <div className="btn-group pull-right">
            <button type="button" className="btn btn-info" onClick={() => this.handleClickConvertTabToLineBreak()}>タブを改行に変換</button>
            <button type="button" className="btn btn-info" onClick={() => this.handleClickDeleteEmptyLines()}>空行の削除</button>
            <button type="button" className="btn btn-primary" onClick={() => this.handleBulkAddItems()}>一括追加</button>
          </div>
        </div>
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

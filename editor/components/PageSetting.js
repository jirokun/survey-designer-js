import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Radio, Checkbox } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as Utils from '../../utils'

class PageSetting extends Component {
  constructor(props) {
    super(props);
  }

  onPageSettingChanged(e) {
    const { changePageSetting } = this.props;
    const value = e.target.value;
    const page = {
      pageId: ReactDOM.findDOMNode(this.refs.pageId).value,
      pageTitle: ReactDOM.findDOMNode(this.refs.pageTitle).value,
      pageSubTitle: ReactDOM.findDOMNode(this.refs.pageSubTitle).value,
      pageLayout: ReactDOM.findDOMNode(this.refs.pageLayout).value
    };
    changePageSetting(page);
  }

  render() {
    const { state } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    // ページが見つからない場合は描画しない(branchの場合)
    if (!page) {
      const branch = Utils.findBranchFromFlow(state, state.values.currentFlowId);
      if (branch) {
        return null;
      } else {
        throw 'invalid currentFlowId: ' + state.values.currentFlowId;
      }
    }
    return (
      <div className="form-container">
        <FormGroup controlId="page_id">
          <ControlLabel>ページID</ControlLabel>
          <FormControl ref="pageId" type="text" value={page.id} onChange={this.onPageSettingChanged.bind(this)} disabled/>
        </FormGroup>

        <FormGroup controlId="page_title">
          <ControlLabel>ページタイトル</ControlLabel>
          <FormControl ref="pageTitle" type="text" value={page.title} onChange={this.onPageSettingChanged.bind(this)}/>
        </FormGroup>

        <FormGroup controlId="page_sub_title">
          <ControlLabel>ページサブタイトル</ControlLabel>
          <FormControl ref="pageSubTitle" type="text" value={page.subTitle} onChange={this.onPageSettingChanged.bind(this)}/>
        </FormGroup>

        <FormGroup controlId="page_layout">
          <ControlLabel>レイアウト</ControlLabel>
          <FormControl ref="pageLayout" componentClass="select" placeholder="select">
            <option value="flow_layout">フローレイアウト</option>
            <option value="grid_layout">グリッドレイアウト</option>
          </FormControl>
        </FormGroup>
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  changePageSetting: value=> dispatch(EditorActions.changePageSetting(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(PageSetting);

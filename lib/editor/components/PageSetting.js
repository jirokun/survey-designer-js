import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PageDefinition from '../../runtime/models/PageDefinition';
import * as EditorActions from '../actions';

class PageSetting extends Component {
  onPageSettingChanged() {
    const { changePage } = this.props;
    console.log(this.pageIdEl);
    const page = new PageDefinition({
      pageId: this.pageIdEl.value,
      pageTitle: this.pageTitleEl.value,
      pageLayout: this.pageLayoutEl.value,
    });
    changePage(page);
  }

  render() {
    const { state } = this.props;
    const flow = state.findCurrentFlow();
    if (!flow.isPage()) {
      return <span>Disabled PageSetting Tab when branch is selected</span>;
    }
    const page = state.findCurrentPage();
    return (
      <div className="form-container">
        <FormGroup controlId="page_id">
          <ControlLabel>ページID</ControlLabel>
          <FormControl
            ref={(el) => { this.pageIdEl = el; }} type="text"
            value={page.getId()} onChange={e => this.onPageSettingChanged(e)} disabled
          />
        </FormGroup>

        <FormGroup controlId="page_title">
          <ControlLabel>ページタイトル</ControlLabel>
          <FormControl
            ref={(el) => { this.pageTitleEl = el; }} type="text"
            value={page.getTitle()} onChange={e => this.onPageSettingChanged(e)}
          />
        </FormGroup>

        <FormGroup controlId="page_layout">
          <ControlLabel>レイアウト</ControlLabel>
          <FormControl ref={(el) => { this.pageLayoutEl = el; }} componentClass="select" placeholder="select">
            <option value="flow_layout">フローレイアウト</option>
            <option value="grid_layout">グリッドレイアウト</option>
          </FormControl>
        </FormGroup>
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changePage: value => dispatch(EditorActions.changePage(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageSetting);

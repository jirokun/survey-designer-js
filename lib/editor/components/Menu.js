/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import * as Action from '../actions';

class Menu extends Component {
  handleSave() {
    const { state } = this.props;
    console.log(JSON.stringify(state.toJS(), null, 2));
  }

  handlePreview() {
    const { state } = this.props;
    if (!this.previewWindow || this.previewWindow.closed) {
      this.previewWindow = window.open('preview.html', 'preview');
      this.previewWindow.addEventListener('load', () => {
        this.previewWindow.focus();
        this.previewWindow.loadState(state);
      }, false);
      return;
    }
    this.previewWindow.loadState(state);
    this.previewWindow.focus();
  }

  render() {
    const { state, changeShowPane } = this.props;
    const viewSetting = state.getViewSetting();
    const pageListToggleStyle = { visibility: viewSetting.getPageListPane() ? 'visible' : 'hidden' };
    const editorToggleStyle = { visibility: viewSetting.getEditorPane() ? 'visible' : 'hidden' };
    const previewToggleStyle = { visibility: viewSetting.getPreviewPane() ? 'visible' : 'hidden' };
    return (
      <Navbar fluid>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={() => this.handleSave()}>保存</NavItem>
            <NavDropdown eventKey={1} title="表示" id="basic-nav-dropdown">
              <MenuItem
                eventKey={1.1}
                href="#"
                onClick={() => changeShowPane('pageListPane', !viewSetting.getPageListPane())}
              >
                <Glyphicon glyph="ok" style={pageListToggleStyle} /> ページ一覧
              </MenuItem>
              <MenuItem
                eventKey={1.2}
                href="#"
                onClick={() => changeShowPane('editorPane', !viewSetting.getEditorPane())}
              >
                <Glyphicon glyph="ok" style={editorToggleStyle} /> デザインビュー
              </MenuItem>
              <MenuItem
                eventKey={1.3}
                href="#"
                onClick={() => changeShowPane('previewPane', !viewSetting.getPreviewPane())}
              >
                <Glyphicon glyph="ok" style={previewToggleStyle} /> プレビュー
              </MenuItem>
            </NavDropdown>
            <NavItem onClick={() => this.handlePreview()}>プレビュー</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeShowPane: (paneName, show) => dispatch(Action.changeShowPane(paneName, show)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Menu);

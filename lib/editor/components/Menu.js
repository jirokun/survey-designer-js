/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import * as Action from '../actions';

export class Menu extends Component {
  render() {
    const { changeShowPane } = this.props;
    return (
      <Navbar fluid>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={1} title="表示" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1} href="#" onClick={() => changeShowPane('pageListPane', false)}><Glyphicon glyph="ok" /> ページ一覧</MenuItem>
              <MenuItem eventKey={1.2} href="#"><Glyphicon glyph="ok" /> デザインビュー</MenuItem>
              <MenuItem eventKey={1.3} href="#"><Glyphicon glyph="ok" /> プレビュー</MenuItem>
            </NavDropdown>
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

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { RIEInput } from 'riek';
import S from 'string';
import $ from 'jquery';
import * as Action from '../actions';
import * as C from '../../constants';

class Menu extends Component {
  handleSave() {
    const { state } = this.props;
    const survey = state.getSurvey();
    return $.ajax({
      method: 'post',
      url: state.getOptions().getSaveUrl(),
      data: { _doc: JSON.stringify(survey.toJS()) },
    }).then((result) => {
      // do nothing
    });
  }

  handlePreview() {
    const { state } = this.props;
    const previewUrl = state.getOptions().getPreviewUrl();

    const previewWindow = window.open(previewUrl, '_blank');
    previewWindow.addEventListener('load', () => {
      previewWindow.focus();
      previewWindow.loadState(state);
    }, false);
  }

  handleChangeTitle(state) {
    const { changeTitle } = this.props;
    changeTitle(state.title);
  }

  handleClickPanel() {
    const { state, openPanel, changePanel } = this.props;
    const panelSelectFn = state.getOptions().getPanelSelectFn();
    openPanel(state, panelSelectFn, changePanel);
  }

  isValidTitle(str) {
    return !S(str).isEmpty();
  }

  render() {
    const { state, changeShowPane } = this.props;
    const survey = state.getSurvey();
    const viewSetting = state.getViewSetting();
    const pageListToggleStyle = { visibility: viewSetting.getPageListPane() ? 'visible' : 'hidden' };
    const confirmSurveyUrl = state.getOptions().getConfirmSurveyUrl();
    const editorToggleStyle = { visibility: viewSetting.getEditorPane() ? 'visible' : 'hidden' };
    const previewToggleStyle = { visibility: viewSetting.getPreviewPane() ? 'visible' : 'hidden' };
    const panel = survey.getPanel();
    const surveyPostStatus = state.getViewSetting().getSaveSurveyStatus();
    let surveyPostStatusLabel;
    if (surveyPostStatus === C.SURVEY_NOT_POSTED) surveyPostStatusLabel = '未保存状態です';
    if (surveyPostStatus === C.SURVEY_POSTED_FAILED) surveyPostStatusLabel = '保存に失敗しました';
    if (surveyPostStatus === C.SURVEY_POSTED_SUCCESS) surveyPostStatusLabel = '保存しました';
    if (surveyPostStatus === C.SURVEY_POSTING) surveyPostStatusLabel = '保存中です';
    return (
      <Navbar fluid>
        <Nav>
          <NavItem>タイトル:
            <RIEInput
              value={survey.getTitle()}
              change={s => this.handleChangeTitle(s)}
              validate={str => this.isValidTitle(str)}
              propName="title"
            />
          </NavItem>
          <NavItem onClick={() => this.handleClickPanel()}>目標回答数: {panel.get('countLabel')} パネル: {panel.get('label')}</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem>{surveyPostStatusLabel}</NavItem>
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
          <NavItem href={confirmSurveyUrl}>配信依頼確認</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeShowPane: (paneName, show) => dispatch(Action.changeShowPane(paneName, show)),
  changeTitle: title => dispatch(Action.changeTitle(title)),
  saveSurvey: (surveyId, survey) => dispatch(Action.saveSurvey(surveyId, survey)),
  openPanel: (state, panelSelectFunc, changePanelFunc) => panelSelectFunc(state, changePanelFunc),
  changePanel: panel => dispatch(Action.changePanel(panel)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Menu);

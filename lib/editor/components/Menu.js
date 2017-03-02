/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { RIEInput } from 'riek';
import S from 'string';
import $ from 'jquery';
import * as Action from '../actions';
import { SURVEY_NOT_POSTED, SURVEY_POSTED_FAILED, SURVEY_POSTED_SUCCESS, SURVEY_POSTING } from '../../constants/states';

/** 画面上部に描画するMenu */
class Menu extends Component {
  /** タイトルのバリデータ */
  static isValidTitle(str) {
    return !S(str).isEmpty();
  }

  /**
   * プレビューをクリックしたときのハンドラ
   * optionsで指定するpreviewUrlの値をもとにプレビューを表示する。
   * 表示された画面にはwindow.loadStateという関数が定義されている必要がある。
   */
  handlePreview() {
    const { state } = this.props;
    const previewUrl = state.getOptions().getPreviewUrl();
    if (S(previewUrl).isEmpty()) throw new Error('previewUrlを指定していないためプレビューは実行できません');

    if (!this.previewWindow || this.previewWindow.closed) {
      this.previewWindow = window.open(previewUrl, '_blank');
      this.previewWindow.addEventListener('load', () => {
        this.previewWindow.focus();
        const survey = state.getSurvey().toJS();
        this.previewWindow.loadState(survey);
      }, false);
      return;
    }
    this.previewWindow.focus();
    const survey = state.getSurvey().toJS();
    this.previewWindow.loadState(survey);
  }

  handleApplication() {
    const { state } = this.props;
    const survey = state.getSurvey();
    const confirmSurveyUrl = state.getOptions().getConfirmSurveyUrl();
    const panel = survey.getPanel();
    if (!panel) {
      alert('パネルを選択してから配信依頼を行ってください');
      return;
    }
    location.href = confirmSurveyUrl;
  }

  /** タイトルが変更されたときのハンドラ */
  handleChangeTitle(state) {
    const { changeTitle } = this.props;
    changeTitle(state.title);
  }

  /**
   * パネルがクリックされたときのハンドラ
   * optionsのpanelSelectFnプロパティに設定された関数を実行する。
   * panelSelectFnのシグネチャは次の通り
   * (state, changePanelCallback) => { }
   *
   * panelSelectFn内でchangePanelCallback(panel)を呼ぶ必要がある。
   * ここで渡したpanelがsurvey.panelに設定される
   */
  handleClickPanel() {
    const { state, openPanel, changePanel } = this.props;
    const panelSelectFn = state.getOptions().getPanelSelectFn();
    openPanel(state, panelSelectFn, changePanel);
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
    if (surveyPostStatus === SURVEY_NOT_POSTED) surveyPostStatusLabel = '未保存状態です';
    if (surveyPostStatus === SURVEY_POSTED_FAILED) surveyPostStatusLabel = '保存に失敗しました';
    if (surveyPostStatus === SURVEY_POSTED_SUCCESS) surveyPostStatusLabel = '保存しました';
    if (surveyPostStatus === SURVEY_POSTING) surveyPostStatusLabel = '保存中です';
    return (
      <Navbar fluid>
        <Nav>
          <NavItem>タイトル:
            <RIEInput
              value={survey.getTitle()}
              change={s => this.handleChangeTitle(s)}
              validate={Menu.isValidTitle}
              propName="title"
            />
          </NavItem>
          <NavItem onClick={() => this.handleClickPanel()}>目標回答数: {panel ? panel.get('countLabel') : ''} パネル: {panel ? panel.get('label') : ''}</NavItem>
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
          <NavItem onClick={() => this.handleApplication()}>配信依頼確認</NavItem>
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

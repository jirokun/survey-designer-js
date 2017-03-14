/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { RIEInput } from 'riek';
import classNames from 'classnames';
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

  componentDidMount() {
    window.addEventListener('message', e => this.handlePostMessage(e), false);
  }

  handlePostMessage(e) {
    const { survey } = this.props;
    if (e.data.type !== 'surveyRequest') return;
    this.previewWindow.focus();
    e.source.postMessage({ type: 'surveyResponse', value: JSON.stringify(survey.toJS()) }, '*');
  }

  /**
   * プレビューをクリックしたときのハンドラ
   * optionsで指定するpreviewUrlの値をもとにプレビューを表示する。
   * 表示された画面にはwindow.loadStateという関数が定義されている必要がある。
   */
  handlePreview() {
    const { options } = this.props;
    const previewUrl = options.getPreviewUrl();
    if (S(previewUrl).isEmpty()) throw new Error('previewUrlを指定していないためプレビューは実行できません');
    this.previewWindow = window.open(previewUrl, '_blank');
  }

  handleApplication() {
    const { options, survey } = this.props;
    const confirmSurveyUrl = options.getConfirmSurveyUrl();
    const panel = survey.getPanel();
    if (!panel) {
      alert('パネルを選択してから配信依頼を行ってください');
      return;
    }
    location.href = confirmSurveyUrl;
  }

  /** タイトルが変更されたときのハンドラ */
  handleChangeTitle(formObj) {
    const { changeTitle } = this.props;
    changeTitle(formObj.title);
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
    const { survey, options, openPanel, changePanel } = this.props;
    const panelSelectFn = options.getPanelSelectFn();
    openPanel(survey, panelSelectFn, changePanel);
  }

  render() {
    const { view, survey, changeShowPane } = this.props;

    const showFlowPane = view.getFlowPane();
    const showEditorPane = view.getEditorPane();
    const showPreviewPane = view.getPreviewPane();

    const surveyPostStatus = view.getSaveSurveyStatus();
    let surveyPostStatusLabel;
    if (surveyPostStatus === SURVEY_NOT_POSTED) surveyPostStatusLabel = '未保存状態です';
    if (surveyPostStatus === SURVEY_POSTED_FAILED) surveyPostStatusLabel = '保存に失敗しました';
    if (surveyPostStatus === SURVEY_POSTED_SUCCESS) surveyPostStatusLabel = '保存しました';
    if (surveyPostStatus === SURVEY_POSTING) surveyPostStatusLabel = '保存中です';

    const panel = survey.getPanel();

    return (
      <Navbar fluid className="enq-navbar">
        <Nav className="enq-navbar-nav enq-navbar-nav__left">
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
        <Nav pullRight className="enq-navbar-nav">
          <NavItem>{surveyPostStatusLabel}</NavItem>
          <NavDropdown eventKey={1} title="表示" id="basic-nav-dropdown">
            <MenuItem
              eventKey={1.1}
              href="#"
              onClick={() => changeShowPane('flowPane', !showFlowPane)}
            >
              <Glyphicon glyph="ok" className={classNames({ invisible: !showFlowPane })} /> ページ一覧
            </MenuItem>
            <MenuItem
              eventKey={1.2}
              href="#"
              onClick={() => changeShowPane('editorPane', !showEditorPane)}
            >
              <Glyphicon glyph="ok" className={classNames({ invisible: !showEditorPane })} /> デザインビュー
            </MenuItem>
            <MenuItem
              eventKey={1.3}
              href="#"
              onClick={() => changeShowPane('previewPane', !showPreviewPane)}
            >
              <Glyphicon glyph="ok" className={classNames({ invisible: !showPreviewPane })} /> プレビュー
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
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
  view: state.getViewSetting(),
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

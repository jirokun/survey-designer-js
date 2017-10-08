/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Glyphicon, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { RIEInput } from 'riek';
import classNames from 'classnames';
import S from 'string';
import * as Action from '../actions';
import SurveyDesignerState from '../../runtime/models/SurveyDesignerState';
import { SURVEY_NOT_POSTED, SURVEY_POSTED_FAILED, SURVEY_POSTED_SUCCESS, SURVEY_POSTING } from '../../constants/states';
import { isDevelopment } from '../../utils';
import MenuConfigModal from './editors/MenuConfigModal';

/** 画面上部に描画するMenu */
class Menu extends Component {
  /** タイトルのバリデータ */
  static isValidTitle(str) {
    return !S(str).isEmpty();
  }

  constructor(props) {
    super(props);

    this.state = {
      showDevelopmentMenu: false,
    };
  }

  componentDidMount() {
    window.addEventListener('message', e => this.handlePostMessage(e), false);

    if (isDevelopment()) {
      // developmentモードならloadSurveyをexposeする
      window.loadSurvey = this.loadSurvey.bind(this);
    }
  }

  handlePostMessage(e) {
    if (e.origin !== location.origin) {
      alert('オリジンが一致しません');
      return;
    }
    const { survey } = this.props;
    if (e.data.type !== 'surveyRequest') return;
    this.previewWindow.focus();
    e.source.postMessage({ type: 'surveyResponse', value: JSON.stringify(survey.toJS()) }, '*');
  }

  /**
   * 動作プレビューをクリックしたときのハンドラ
   * optionsで指定するpreviewUrlの値をもとにプレビューを表示する。
   */
  handleClickPreview() {
    const { options } = this.props;
    const url = options.getPreviewUrl();
    if (S(url).isEmpty()) throw new Error('previewUrlを指定していないためプレビューは実行できません');
    this.previewWindow = window.open(url, '_blank');
  }

  /**
   * 詳細プレビューをクリックしたときのハンドラ
   * optionsで指定するshowDetailUrlの値をもとにプレビューを表示する。
   */
  handleClickShowDetail() {
    const { options } = this.props;
    const url = options.getShowDetailUrl();
    if (S(url).isEmpty()) throw new Error('showDetailUrlを指定していないためプレビューは実行できません');
    this.previewWindow = window.open(url, '_blank');
  }

  handleValidation() {
    const { survey } = this.props;
    const errors = survey.validate();
    if (errors.size !== 0) {
      alert(errors.join('\n'));
    } else {
      alert('このアンケートは正しく設定されています');
    }
  }

  handleApplication() {
    const { options, survey } = this.props;
    const confirmSurveyUrl = options.getConfirmSurveyUrl();
    const errors = survey.validate();
    if (errors.size !== 0) {
      alert(errors.join('\n'));
      return;
    }
    location.href = confirmSurveyUrl;
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

  /** ファイルを読み込みできるようにする */
  handleFileChange(e) {
    const { survey } = this.props;

    if (!isDevelopment()) return;
    const fileInputEl = e.target;
    const file = fileInputEl.files[0];
    if (!file) return; // fileが選択されていなければ何もしない
    // ファイルの内容は FileReader で読み込みます.
    const m = file.name.match(/^.*\.json$/i);
    if (!m) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      json._id = survey.getId(); // surveyのidは更新しない
      this.loadSurvey(json);
      fileInputEl.value = null;
    };
    fileReader.readAsText(file);
  }

  loadSurvey(json) {
    const surveyDesignerState = SurveyDesignerState.createFromJson({ survey: json });
    this.props.loadSurvey(surveyDesignerState.getSurvey());
  }

  createDevelopmentMenu() {
    if (!isDevelopment()) return null;

    const { survey, showAllJavaScriptEditor } = this.props;

    const surveyJson = survey.toJson();
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(surveyJson)}`;

    const fileName = `${survey.getTitle()}.json`;

    return [
      <NavDropdown key="menu-development" className="menu-development" eventKey={2} title="開発モードメニュー" id="basic-nav-dropdown">
        <NavItem eventKey={2.1} key="menu-development-export" onClick={() => this.setState({ showDevelopmentMenu: true })}>アンケート定義のエクスポート</NavItem>
        <NavItem eventKey={2.2} key="menu-development-js-editor" onClick={() => showAllJavaScriptEditor()}>全ページのJavaScript編集</NavItem>
      </NavDropdown>,
      (<Modal key="dialog-development" show={this.state.showDevelopmentMenu} onHide={() => this.setState({ showDevelopmentMenu: false })}>
        <Modal.Body>
          <div><a className="btn btn-primary" href={dataStr} download={fileName}>アンケート定義のエクスポート</a></div>
          <hr />
          <div>アンケート定義のインポート<input type="file" onChange={e => this.handleFileChange(e)} /></div>
        </Modal.Body>
      </Modal>),
    ];
  }

  createConfigMenu() {
    const { showMenuConfig } = this.props;

    return [
      <NavItem key="menu-config" className="menu-config" onClick={() => showMenuConfig()}>全体設定</NavItem>,
      <SurveySettingEditor key="dialog-config" />,
    ];
  }

  render() {
    const { view, survey, changeShowPane, changeSurveyAttribute } = this.props;

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
          <NavItem className="menu-title">タイトル:
            <RIEInput
              value={survey.getTitle()}
              change={s => changeSurveyAttribute('title', s.title)}
              validate={Menu.isValidTitle}
              editProps={{ maxLength: 64 }}
              propName="title"
            />
          </NavItem>
          <NavItem onClick={() => this.handleClickPanel()} className="menu-panel">
            目標回答数: {panel ? panel.get('countLabel') : ''} パネル: {panel ? panel.get('label') : ''}
          </NavItem>
        </Nav>
        <Nav pullRight className="enq-navbar-nav">
          {surveyPostStatus ? <NavItem className="menu-survey-post-status">{surveyPostStatusLabel}</NavItem> : null}

          {this.createDevelopmentMenu()}
          {this.createConfigMenu()}

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

          <NavDropdown className="menu-preview" eventKey={1} title="プレビュー" id="basic-nav-dropdown">
            <MenuItem eventKey={1.1} className="menu-dynamic-preview" href="#" onClick={() => this.handleClickPreview()}>動作プレビュー</MenuItem>
            <MenuItem eventKey={1.1} className="menu-detail-preview" href="#" onClick={() => this.handleClickShowDetail()}>詳細プレビュー</MenuItem>
          </NavDropdown>

          <NavDropdown className="menu-application" eventKey={3} title="申請">
            <MenuItem eventKey={3.1} className="menu-validation" onClick={() => this.handleValidation()}>申請前チェック</MenuItem>
            <MenuItem eventKey={3.2} className="menu-delivery-confirm" onClick={() => this.handleApplication()}>配信依頼確認</MenuItem>
          </NavDropdown>
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
  changeSurveyAttribute: (attributeName, value) => dispatch(Action.changeSurveyAttribute(attributeName, value)),
  showAllJavaScriptEditor: () => dispatch(Action.changeShowAllJavaScriptEditor(true)),
  saveSurvey: (surveyId, survey) => dispatch(Action.saveSurvey(surveyId, survey)),
  openPanel: (state, panelSelectFunc, changePanelFunc) => panelSelectFunc(state, changePanelFunc),
  changePanel: panel => dispatch(Action.changePanel(panel)),
  loadSurvey: survey => dispatch(Action.loadSurvey(survey)),
  showMenuConfig: () => dispatch(Action.changeShowMenuConfig(true)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Menu);

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Well, Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import moment from 'moment';
import { List, Map } from 'immutable';
import * as Action from '../../actions';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import '../../css/allJavaScriptEditor.scss';


/** エディタの領域を描画する */
class AllJavaScriptEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { code: this.getAllJavaScriptCodeInSurvey(), savedAt: null };
  }

  shouldComponentUpdate(nextProps) {
    const { view } = nextProps;
    return this.state.savedAt !== view.getAllJavaScriptSavedAt();
  }

  componentWillUpdate(nextProps) {
    const { view } = nextProps;
    if (this.state.savedAt !== view.getAllJavaScriptSavedAt()) {
      this.setState({ savedAt: view.getAllJavaScriptSavedAt() });
    }
  }

  getAllJavaScriptCodeInSurvey() {
    const { survey } = this.props;
    let allCode = '';
    survey.getPages().forEach((page) => {
      const content = page.getJavaScriptCode() ? `${page.getJavaScriptCode()}\n` : '';
      allCode += `${this.getStartComment(page.getId())}\n${content}${this.getEndComment(page.getId())}\n`;
    });
    return allCode;
  }

  saveAllJavaScript() {
    const { survey, saveAllJavaScript } = this.props;
    const errors = this.validate();
    if (errors.size !== 0) {
      return alert(errors.join('\n'));
    }

    let idAndJs = Map();
    survey.getPages().forEach((page) => {
      const start = this.state.code.indexOf(this.getStartComment(page.getId())) + `${this.getStartComment(page.getId())}\n`.length;
      const end = this.state.code.indexOf(this.getEndComment(page.getId())) - 1;
      idAndJs = idAndJs.set(page.getId(), this.state.code.slice(start, end));
    });

    saveAllJavaScript(idAndJs);
  }

  validate() {
    const { survey } = this.props;

    let errors = List();
    if (!this.hasAllSeparateComment(survey)) {
      errors = errors.push('全てのページの区切りコメントがありません');
    }
    if (this.hasStringBetweenEndToStart(survey)) {
      errors = errors.push('区切り文字の終了から次の区切り文字の開始までの間に文字があります');
    }
    if (this.hasStringBeforeStart(survey)) {
      errors = errors.push('区切り文字の開始前に文字があります');
    }
    if (this.hasStringAfterEnd(survey)) {
      errors = errors.push('区切り文字の終了後に文字があります');
    }
    return errors;
  }

  /** code中にすべての区切りコメントがあるか */
  hasAllSeparateComment(survey) {
    let ret = true;
    survey.getPages().forEach((page) => {
      if (this.state.code.indexOf(this.getStartComment(page.getId())) === -1
        || this.state.code.indexOf(this.getEndComment(page.getId())) === -1) {
        ret = false;
      }
    });
    return ret;
  }

  /** codeの終了コメント〜次の開始コメント前に文字があるか */
  hasStringBetweenEndToStart(survey) {
    let ret = false;
    survey.getPages().forEach((page) => {
      const end = this.state.code.indexOf(this.getEndComment(page.getId())) + `${this.getEndComment(page.getId())}\n`.length;
      const nextNodePageId = survey.findNextPageIdFromRefId(page.getId());
      if (nextNodePageId !== null) {
        const nextStart = this.state.code.indexOf(this.getStartComment(nextNodePageId)) - 1;
        const str = this.state.code.slice(end, nextStart);
        if (str.length !== 0) { ret = true; }
      }
    });
    return ret;
  }

  hasStringBeforeStart(survey) {
    const page = survey.getPages().first();
    const start = this.state.code.indexOf(this.getStartComment(page.getId()));
    const str = this.state.code.slice(0, start);
    return str.length !== 0;
  }

  hasStringAfterEnd(survey) {
    const page = survey.getPages().last();
    const end = this.state.code.indexOf(this.getEndComment(page.getId())) + `${this.getEndComment(page.getId())}\n`.length;
    const str = this.state.code.slice(end, -1);
    return str.length !== 0;
  }

  hideAllJavaScriptEditor() {
    if (this.state.code !== this.getAllJavaScriptCodeInSurvey() && !confirm('保存されていないJavaScriptがあります。本当に保存せずにページ遷移しますか？')) return;
    const { hideAllJavaScriptEditor } = this.props;
    hideAllJavaScriptEditor();
  }

  handleOnChange(code) {
    this.setState({ code });
  }

  getStartComment(pageId) {
    return `// Page Start: ${pageId}`;
  }

  getEndComment(pageId) {
    return `// Page End: ${pageId}`;
  }

  showSaveNotification() {
    const dateStr = moment(new Date(this.state.savedAt)).format('YYYY年MM月DD日 HH:mm:ss');
    return <div key={this.state.savedAt} className="bg-success allJavaScriptEditor__notification">{dateStr}に全JavaScriptを保存しました</div>;
  }

  render() {
    const { survey } = this.props;
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };

    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <h1 className="allJavaScriptEditor__title">
              {survey.getTitle()}の全てのJavaScript編集
              {this.state.savedAt && this.showSaveNotification()}
              <Button
                bsStyle="success"
                className="pull-right allJavaScriptEditor__btn-save"
                onClick={() => this.saveAllJavaScript()}
              >
                保存
              </Button>
              <Button
                bsStyle="default"
                className="pull-right allJavaScriptEditor__btn-close"
                onClick={() => this.hideAllJavaScriptEditor()}
              >
                戻る
              </Button>
            </h1>
            <Well>
              <CodeMirror
                value={this.state.code}
                options={options}
                onChange={str => this.handleOnChange(str)}
              />
            </Well>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  hideAllJavaScriptEditor: () => dispatch(Action.changeShowAllJavaScriptEditor(false)),
  saveAllJavaScript: idAndJs => dispatch(Action.saveAllJavaScript(idAndJs, Date.now())),
});

export default connect(
  stateToProps,
  actionsToProps,
)(AllJavaScriptEditor);

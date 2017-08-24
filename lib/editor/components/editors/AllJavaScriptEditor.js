/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Well, Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import * as Action from '../../actions';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import '../../css/allJavaScriptEditor.scss';


/** エディタの領域を描画する */
class AllJavaScriptEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { code: this.getAllJavaScriptCodeInSurvey() };
  }

  shouldComponentUpdate(nextProps) {
    return false; // state.code が変わっても更新はしない
  }

  getAllJavaScriptCodeInSurvey() {
    const { survey } = this.props;
    let allCode = '';
    survey.getPages().forEach((page) => {
      allCode += `${this.getStartComment(page)}${page.getJavaScriptCode()}\n${this.getEndComment(page)}`;
    });
    return allCode;
  }

  saveAllJavaScript() {
    const { survey, saveAllJavaScript } = this.props;
    // TODO: バリデーションを実装
    const idAndJs = {};
    survey.getPages().forEach((page) => {
      const start = this.state.code.indexOf(this.getStartComment(page)) + this.getStartComment(page).length;
      const end = this.state.code.indexOf(this.getEndComment(page)) - 1;
      idAndJs[page.getId()] = this.state.code.slice(start, end);
      console.log(`${page.getId()} : ${idAndJs[page.getId()]}`); // FIXME: デバック用、削除する
    });

    saveAllJavaScript(idAndJs);
  }

  hideAllJavaScriptEditor() {
    if (this.state.code !== this.getAllJavaScriptCodeInSurvey() && !confirm('保存されていないJavaScriptがあります。本当に保存せずにページ遷移しますか？')) return;
    const { hideAllJavaScriptEditor } = this.props;
    hideAllJavaScriptEditor();
  }

  handleOnChange(code) {
    this.setState({ code });
  }

  getStartComment(page) {
    return `// Page Start: ${page.getId()}\n`;
  }

  getEndComment(page) {
    return `// Page End: ${page.getId()}\n`;
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
  saveAllJavaScript: idAndJs => dispatch(Action.saveAllJavaScript(idAndJs, false)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(AllJavaScriptEditor);

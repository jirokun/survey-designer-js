/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import moment from 'moment';
import * as Action from '../../actions';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import '../../css/allJavaScriptEditor.scss';
import AllJavaScriptCode from '../../models/AllJavaScriptCode';

/** 全JavaScriptのエディタ領域を描画する */
class AllJavaScriptEditor extends Component {
  constructor(props) {
    super(props);

    this.onUnload = this.onUnload.bind(this);

    const { survey } = this.props;
    this.state = { code: AllJavaScriptCode.create(survey).getCode(), savedAt: null };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
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

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  /** デフォルトメッセージを表示して、下記メッセージが出ない(実装ミス? ブラウザの挙動?)、目的は達成しているので一旦このまま */
  onUnload(event) {
    const confirmationMessage = '保存されていないJavaScriptがあります。本当に保存せずにページ遷移しますか？';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  saveAllJavaScript() {
    const { survey, saveAllJavaScript, saveSavedAtOnAllJavaScript } = this.props;
    const allJavaScriptCode = new AllJavaScriptCode({ code: this.state.code });
    const errors = allJavaScriptCode.validate(survey);
    if (errors.size !== 0) {
      alert(errors.join('\n'));
      return;
    }

    saveAllJavaScript(allJavaScriptCode);
    saveSavedAtOnAllJavaScript();
  }

  hideAllJavaScriptEditor() {
    const { survey, hideAllJavaScriptEditor } = this.props;
    const allJavaScriptCode = new AllJavaScriptCode({ code: this.state.code });
    if (allJavaScriptCode.isChangedCode(survey) && !confirm('保存されていないJavaScriptがあります。本当に保存せずにページ遷移しますか？')) return;
    hideAllJavaScriptEditor();
  }

  handleOnChange(code) {
    this.setState({ code });
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

    return (<div className="allJavaScriptEditor">
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
      <CodeMirror
        value={this.state.code}
        options={options}
        onChange={str => this.handleOnChange(str)}
      />
    </div>);
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  hideAllJavaScriptEditor: () => dispatch(Action.changeShowAllJavaScriptEditor(false)),
  saveAllJavaScript: allJavaScriptCode => dispatch(Action.saveAllJavaScript(allJavaScriptCode)),
  saveSavedAtOnAllJavaScript: () => dispatch(Action.saveSavedAtOnAllJavaScript(Date.now())),
});

export default connect(
  stateToProps,
  actionsToProps,
)(AllJavaScriptEditor);

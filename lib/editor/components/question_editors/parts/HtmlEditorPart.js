/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import debounce from 'throttle-debounce/debounce';

/**
 * QuestionのHTMLを編集するときに使用するEditor
 * 渡されたattributenameの値を更新する。
 * 値はhtmlとplainTextの２つをdispatchする
 */
class HtmlEditorPart extends Component {
  /** コンストラクタ */
  constructor(props) {
    super(props);
    this.cuid = cuid();
    this.debouncedHandleTinyMCEChange = debounce(200, (html, text) => this.handleTinyMCEChange(html, text));
    this.state = {
      tinymceVisible: false,
    };
  }

  /** Reactのライフサイクルメソッド */
  shouldComponentUpdate() {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el || !el.classList.contains('html-editor-tinymce');
  }

  /** tinymceの値が変更になったときのハンドラ */
  handleTinyMCEChange(html, text) {
    const { onChange } = this.props;
    onChange(html, text);
  }

  /** tinymceの表示を切り替える */
  handleTinyMCEVisibleChange(bool) {
    setTimeout(() => {
      delete this.editor;
      // すぐにvisible falseにするとonChangeが走ったときにインスタンスが存在しなくなっておりエラーとなるため、nextTickにする
      this.setState({ tinymceVisible: bool });
    }, 1);
  }

  handleTinyMCEInit(e, editor) {
    const { survey, runtime } = this.props;
    this.editor = editor;
    this.editor.focus();
    // pluginで使うため下記の設定をsettingsに格納しておく
    this.editor.settings.survey = survey;
    this.editor.settings.outputDefinitions = survey.findPrecedingOutputDefinition(runtime.getCurrentNodeId(), false);
  }

  render() {
    const { runtime, survey, content } = this.props;
    const toolbar = this.props.toolbar || 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen reference_answer';
    const replacer = survey.createReplacer(runtime.getAnswers().toJS());
    if (this.state.tinymceVisible) {
      return (
        <TinyMCE
          id={this.cuid}
          className="html-editor-tinymce"
          config={{
            menubar: '',
            toolbar,
            plugins: 'table contextmenu textcolor paste fullscreen link reference_answer',
            inline: true,
            statusbar: false,
          }}
          onKeyup={(e, editor) => this.debouncedHandleTinyMCEChange(editor.getContent(), editor.getContent({ format: 'text' }))}
          onChange={(e, editor) => this.debouncedHandleTinyMCEChange(editor.getContent(), editor.getContent({ format: 'text' }))}
          onBlur={() => this.handleTinyMCEVisibleChange(false)}
          onInit={(e, editor) => this.handleTinyMCEInit(e, editor)}
          content={replacer.id2No(content)}
        />
      );
    }
    return (
      <div
        className="form-control-static html-editor"
        onClick={() => this.handleTinyMCEVisibleChange(true)}
        dangerouslySetInnerHTML={{ __html: replacer.id2No(content) }}
      />
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
});

export default connect(
  stateToProps,
)(HtmlEditorPart);

/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import classNames from 'classnames';
import S from 'string';
import debounce from 'throttle-debounce/debounce';
import { isDevelopment } from '../../../../utils';
import '../../../../constants/tinymce_ja';

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
    onChange(S(html).trim().s, S(text).trim().s);
  }

  /** tinymceの表示を切り替える */
  handleTinyMCEVisibleChange(bool) {
    setTimeout(() => {
      if (!bool) {
        // tinymceが非表示になるときはdebounceせずにすぐに更新する
        this.handleTinyMCEChange(this.editor.getContent(), this.editor.getContent({ format: 'text' }));
      }
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
    this.editor.settings.outputDefinitions = survey.findPrecedingOutputDefinition(runtime.getCurrentNodeId(), true);
  }

  render() {
    const { runtime, survey, options, content, disabled } = this.props;
    const toolbar = this.props.toolbar ||
      `bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen ${isDevelopment() ? 'code' : ''} reference_answer image_manager`;
    const replacer = survey.getReplacer(runtime.getAnswers().toJS());
    if (!disabled && this.state.tinymceVisible) {
      return (
        <TinyMCE
          id={this.cuid}
          className="html-editor-tinymce"
          config={{
            menubar: '',
            toolbar,
            plugins: `table contextmenu textcolor paste fullscreen link ${isDevelopment() ? 'code' : ''} reference_answer image_manager`,
            inline: true,
            statusbar: false,
            target_list: false,
            imageManagerUrl: options.getImageManagerUrl(),
            default_link_target: '_blank',
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
        className={classNames('form-control-static html-editor', { disabled })}
        onClick={() => this.handleTinyMCEVisibleChange(true)}
        dangerouslySetInnerHTML={{ __html: replacer.id2No(content) }}
      />
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(HtmlEditorPart);

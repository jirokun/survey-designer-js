import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import debounce from 'throttle-debounce/debounce';
import * as EditorActions from '../../../actions';

/**
 * QuestionのHTMLを編集するときに使用するEditor
 * 渡されたattributenameの値を更新する。
 * 値はhtmlとplainTextの２つをdispatchする
 */
class QuestionHtmlEditorPart extends Component {
  /** コンストラクタ */
  constructor(props) {
    super(props);
    this.cuid = cuid();
    this.debouncedHandleTinyMCEChange = debounce(200, (html, text) => this.handleTinyMCEChange(html, text));
    this.state = {
      tinymceVisible: false,
    };
  }

  /** tinymceの値が変更になったときのハンドラ */
  handleTinyMCEChange(html, text) {
    const { onChange } = this.props;
    onChange(html, text);
  }

  /** tinymceの表示を切り替える */
  handleTinyMCEVisibleChange(bool) {
    setTimeout(() => {
      // すぐにvisible falseにするとonChangeが走ったときにインスタンスが存在しなくなっておりエラーとなるため、nextTickにする
      this.setState({ tinymceVisible: bool });
    }, 1);
  }

  render() {
    const { runtime, survey, content } = this.props;
    const toolbar = this.props.toolbar || 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen';
    const replacer = survey.getReplacer(runtime.getAnswers().toJS());
    if (this.state.tinymceVisible) {
      return (
        <TinyMCE
          id={this.cuid}
          config={{
            menubar: '',
            toolbar,
            plugins: 'table contextmenu textcolor paste fullscreen link',
            inline: false,
            height: 40,
            statusbar: false,
          }}
          onKeyup={(e, editor) => this.debouncedHandleTinyMCEChange(editor.getContent(), editor.getContent({ format: 'text' }))}
          onChange={(e, editor) => this.debouncedHandleTinyMCEChange(editor.getContent(), editor.getContent({ format: 'text' }))}
          onBlur={() => this.handleTinyMCEVisibleChange(false)}
          onInit={(e, editor) => editor.focus()}
          content={replacer.name2OutputNo(content)}
        />
      );
    }
    return (
      <div
        className="form-control-static html-editor"
        onClick={() => this.handleTinyMCEVisibleChange(true)}
        dangerouslySetInnerHTML={{ __html: replacer.name2OutputNo(content) }}
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
)(QuestionHtmlEditorPart);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../../actions';

/**
 * QuestionのHTMLを編集するときに使用するEditor
 * 渡されたattributenameの値を更新する。
 * 値はhtmlとplainTextの２つをdispatchする
 */
class QuestionHtmlEditor extends Component {
  /** コンストラクタ */
  constructor(props) {
    super(props);
    this.cuid = cuid();
  }

  /** Reactのライフサイクルメソッド */
  componentDidUpdate(prevProps) {
    const oldPage = prevProps.page;
    const page = this.props.page;
    // 同じpageを編集中はupdateしない
    if (oldPage.id === page.id) {
      return;
    }
    const { question } = this.props;
    const questionTitleEditor = tinymce.EditorManager.get(this.cuid);
    questionTitleEditor.setContent(question.getTitle());
  }

  /** tinymceの値が変更になったときのハンドラ */
  handleTinyMCEChange(editor) {
    const { attributeName, page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attributeName, editor.getContent(), editor.getContent({ format: 'text' }));
  }

  render() {
    const { question, attributeName } = this.props;
    return (
      <TinyMCE
        id={this.cuid}
        config={{
          menubar: '',
          toolbar: 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen',
          plugins: 'table contextmenu textcolor paste fullscreen link',
          inline: false,
          height: 40,
          statusbar: false,
        }}
        onKeyup={(e, editor) => this.handleTinyMCEChange(editor)}
        onChange={(e, editor) => this.handleTinyMCEChange(editor)}
        content={question[attributeName]}
      />
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value, subValue) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value, subValue)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(QuestionHtmlEditor);

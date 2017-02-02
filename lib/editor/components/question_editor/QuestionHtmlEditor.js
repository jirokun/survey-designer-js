import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../../actions';

class QuestionHtmlEditor extends Component {
  constructor(props) {
    super(props);
    this.uuid = uuid.v4();
  }

  componentDidUpdate(prevProps) {
    const oldPage = prevProps.page;
    const page = this.props.page;
    if (oldPage.id === page.id) {
      return;
    }
    const { question } = this.props;
    const questionTitleEditor = tinymce.EditorManager.get(this.uuid);
    questionTitleEditor.setContent(question.getTitle());
  }

  handleTinyMCEChange(editor) {
    const { attributeName, page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attributeName, editor.getContent(), editor.getContent({ format: 'text' }));
  }

  render() {
    const { question, attributeName } = this.props;
    return (
      <TinyMCE
        id={this.uuid}
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

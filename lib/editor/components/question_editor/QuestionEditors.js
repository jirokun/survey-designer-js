import CheckboxQuestionEditor from './CheckboxQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
}

export findQuestionEditorClass(className) {
  return editors[className];
}

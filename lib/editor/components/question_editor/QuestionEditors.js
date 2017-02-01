import CheckboxQuestionEditor from './CheckboxQuestionEditor';
import RadioQuestionEditor from './RadioQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
  RadioQuestionEditor,
};

export function findQuestionEditorClass(className) {
  return editors[className];
}

import CheckboxQuestionEditor from './CheckboxQuestionEditor';
import RadioQuestionEditor from './RadioQuestionEditor';
import MultiNumberQuestionEditor from './MultiNumberQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
  RadioQuestionEditor,
  MultiNumberQuestionEditor,
};

export function findQuestionEditorClass(className) {
  return editors[className];
}

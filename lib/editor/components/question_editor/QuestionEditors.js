import CheckboxQuestionEditor from './CheckboxQuestionEditor';
import RadioQuestionEditor from './RadioQuestionEditor';
import MultiNumberQuestionEditor from './MultiNumberQuestionEditor';
import SingleTextQuestionEditor from './SingleTextQuestionEditor';
import TextQuestionEditor from './TextQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
  RadioQuestionEditor,
  MultiNumberQuestionEditor,
  SingleTextQuestionEditor,
  TextQuestionEditor,
};

export function findQuestionEditorClass(className) {
  return editors[`${className}QuestionEditor`];
}

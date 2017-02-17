import CheckboxQuestionEditor from './CheckboxQuestionEditor';
import RadioQuestionEditor from './RadioQuestionEditor';
import MultiNumberQuestionEditor from './MultiNumberQuestionEditor';
import SingleTextQuestionEditor from './SingleTextQuestionEditor';
import TextQuestionEditor from './TextQuestionEditor';
import DescriptionQuestionEditor from './DescriptionQuestionEditor';

const editors = {
  CheckboxQuestionEditor,
  RadioQuestionEditor,
  MultiNumberQuestionEditor,
  SingleTextQuestionEditor,
  TextQuestionEditor,
  DescriptionQuestionEditor,
};

export function findQuestionEditorClass(className) {
  return editors[`${className}QuestionEditor`];
}

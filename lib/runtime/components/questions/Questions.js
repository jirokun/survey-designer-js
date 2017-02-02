import CheckboxQuestion from './CheckboxQuestion';
import RadioQuestion from './RadioQuestion';
import MultiNumberQuestion from './MultiNumberQuestion';
import MatrixQuestion from './MatrixQuestion';
import SelectQuestion from './SelectQuestion';
import TextQuestion from './TextQuestion';
import TextareaQuestion from './TextareaQuestion';

const questions = {
  CheckboxQuestion,
  RadioQuestion,
  MultiNumberQuestion,
  MatrixQuestion,
  SelectQuestion,
  TextQuestion,
  TextareaQuestion,
};

export function findQuestionClass(className) {
  return questions[className];
}

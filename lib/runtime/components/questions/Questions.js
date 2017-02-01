import CheckboxQuestion from './CheckboxQuestion';
import MatrixQuestion from './MatrixQuestion';
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './SelectQuestion';
import TextQuestion from './TextQuestion';
import TextareaQuestion from './TextareaQuestion';

const questions = {
  CheckboxQuestion,
  MatrixQuestion,
  RadioQuestion,
  SelectQuestion,
  TextQuestion,
  TextareaQuestion,
};

export function findQuestionClass(className) {
  return questions[className];
}

import CheckboxQuestion from './CheckboxQuestion';
import RadioQuestion from './RadioQuestion';
import MultiNumberQuestion from './MultiNumberQuestion';
import SingleTextQuestion from './SingleTextQuestion';
import MatrixQuestion from './MatrixQuestion';
import SelectQuestion from './SelectQuestion';
import TextQuestion from './TextQuestion';

const questions = {
  CheckboxQuestion,
  RadioQuestion,
  MultiNumberQuestion,
  SingleTextQuestion,
  MatrixQuestion,
  SelectQuestion,
  TextQuestion,
};

export function findQuestionClass(className) {
  return questions[className];
}

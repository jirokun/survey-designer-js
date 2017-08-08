import NumericInput from './NumericInput';
import Matrix from './Matrix';
import Schedule from './Schedule';
import ImagePopup from './ImagePopup';

/**
 * ページ単位で初期化する必要のあるコンポーネント
 */
export function pagePlainComponents(pageEl) {
  new ImagePopup(pageEl).init();
}

/**
 * Surveyで一度定義すれば良いコンポーネント
 */
export function plainComponents(el) {
  new NumericInput(el).init();
  new Matrix(el).init();
  new Schedule(el).init();
}

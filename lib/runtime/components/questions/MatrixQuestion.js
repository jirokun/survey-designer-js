import React from 'react';
import S from 'string';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';

/** CheckboxQuestion, RadioQuestionの基底クラス */
export default class MatrixQuestion extends TransformQuestion {
  /** inputを作成する */
  static createInputElement(tableId, rowId, question, item, subItem) {
    const matrixType = question.getMatrixType();
    const name = question.isMatrixReverse() ? question.getOutputName(subItem, item) : question.getOutputName(item, subItem);
    const value = question.isMatrixReverse() ? question.getOutputValue(item) : question.getOutputValue(subItem);
    switch (matrixType) {
      case 'radio':
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            data-parsley-class-handler={`#${tableId}`}
            data-parsley-required
            data-parsley-required-message="すべての行について選択してください"
          />
        );
      case 'text':
      case 'number':
        return (
          <input
            type={matrixType}
            name={name}
            data-parsley-required
          />
        );
      case 'checkbox':
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            data-parsley-class-handler={`#${rowId}`}
            data-parsley-required
            data-parsley-multiple={item.getId()}
            data-parsley-required-message="最低一つ選択してください"
          />
        );
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  static createRow(tableId, question, item, itemIndex, subItems, replacer) {
    const rowId = `${question.getId()}_${item.getId()}`;
    return (
      <tr key={rowId} id={rowId}>
        <td dangerouslySetInnerHTML={{ __html: replacer.name2Value(item.getLabel()) }} />
        {subItems.map(subItem => (
          <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`}>
            <label>
              {MatrixQuestion.createInputElement(tableId, rowId, question, item, subItem)}
            </label>
          </td>))
        }
      </tr>
    );
  }

  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** 描画 */
  render() {
    const { replacer, question } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const tableId = `${question.getId()}_table`;
    const items = question.getTransformedItems();
    const subItems = question.getTransformedSubItems();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replacer.name2Value(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.name2Value(description) }} />}
        <div className="question">
          <table className="matrix group question-form-grid-table" id={tableId}>
            <thead>
              <tr>
                <td />
                {subItems.map(subItem => <td key={subItem.getId()} dangerouslySetInnerHTML={{ __html: replacer.name2Value(subItem.getLabel()) }} />)}
              </tr>
            </thead>
            <tbody>
              {items.map((item, itemIndex) => MatrixQuestion.createRow(tableId, question, item, itemIndex, subItems, replacer))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

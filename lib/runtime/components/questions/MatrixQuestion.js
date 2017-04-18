import { connect } from 'react-redux';
import React from 'react';
import S from 'string';
import classNames from 'classnames';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';
import QuestionDetail from '../parts/QuestionDetail';
import Value from '../parts/Value';

/** CheckboxQuestion, RadioQuestionの基底クラス */
class MatrixQuestion extends TransformQuestion {
  /** 追加の入力elementを作成する */
  static createAdditionalInputElement(question, item, subItem) {
    const matrixType = question.getMatrixType();
    if (matrixType !== 'checkbox' && matrixType !== 'radio') return null;

    const targetItem = question.isMatrixReverse() ? item : subItem;
    if (!targetItem.hasAdditionalInput()) return null;

    const name = question.isMatrixReverse() ? question.getAdditionalOutputName(subItem, item) : question.getAdditionalOutputName(item, subItem);
    return (
      <span>
        <input
          type={targetItem.getAdditionalInputType()}
          name={name}
          disabled
          className="disabled additional-input"
          data-parsley-required
        />
        {targetItem.getUnit()}
      </span>
    );
  }

  /** inputを作成する */
  static createInputElement(tableId, rowId, question, item, subItem) {
    const matrixType = question.getMatrixType();
    const name = question.isMatrixReverse() ? question.getOutputName(subItem, item) : question.getOutputName(item, subItem);
    const value = question.isMatrixReverse() ? question.getOutputValue(item) : question.getOutputValue(subItem);
    switch (matrixType) {
      case 'radio': {
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className="matrix-value"
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-required
            data-parsley-required-message={`すべての${question.isMatrixReverse() ? '列' : '行'}について選択してください`}
          />
        );
      }
      case 'text':
        return (
          <input
            type={matrixType}
            name={name}
            data-parsley-required
          />
        );
      case 'number':
        return (
          <input
            type={matrixType}
            name={name}
            className="sdj-numeric"
            size="4"
            data-parsley-required
          />
        );
      case 'checkbox': {
        const multipleId = question.isMatrixReverse() ? subItem.getId() : item.getId();
        const exclusive = question.isMatrixReverse() ? item.isExclusive() : subItem.isExclusive();
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className={classNames('matrix-value', { exclusive })}
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-required
            data-parsley-multiple={multipleId}
            data-parsley-required-message="最低一つ選択してください"
          />
        );
      }
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** 列の合計行を作成する */
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  createSumColRow(question, items, replacer) {
    const { options } = this.props;
    if (question.getMatrixType() === 'number' && question.isMatrixSumCols()) {
      return (
        <tr>
          <td>合計</td>
          {
            items.map((item) => {
              const totalName = question.getOutputTotalColName(item);
              const colId = `${question.getId()}_${item.getId()}_sum`;
              const totalEqualTo = item.getTotalEqualTo();
              const showValidation = options.isShowDetail() && !S(totalEqualTo).isEmpty();
              return (
                <td key={colId} className={classNames({ 'detail-shown': showValidation })}>
                  { showValidation ? <div className="detail"><span className="validation-detail"><Value className="" value={totalEqualTo} />と一致</span></div> : null}
                  <input
                    name={totalName}
                    className="sdj-sum disabled"
                    type="number"
                    readOnly
                    defaultValue="0"
                    data-parsley-required
                    data-parsley-type="digits"
                    data-parsley-equal={!S(totalEqualTo).isEmpty() ? replacer.id2Value(totalEqualTo) : null}
                  />
                </td>
              );
            })
          }
        </tr>
      );
    }
    return null;
  }

  createRow(tableId, item, itemIndex, subItems, replacer) {
    const { options, question } = this.props;
    const rowId = `${question.getId()}_${item.getId()}`;
    const totalName = question.getOutputTotalRowName(item);
    let sumEl = null;
    if (question.getMatrixType() === 'number' && question.isMatrixSumRows()) {
      const totalEqualTo = item.getTotalEqualTo();
      const showValidation = options.isShowDetail() && !S(totalEqualTo).isEmpty();
      sumEl = (
        <td className={classNames({ 'detail-shown': showValidation })}>
          { showValidation ? <div className="detail"><span className="validation-detail"><Value className="" value={totalEqualTo} />と一致</span></div> : null}
          <input
            name={totalName}
            className="sdj-sum disabled"
            type="number"
            readOnly
            defaultValue="0"
            data-parsley-required
            data-parsley-type="digits"
            data-parsley-equal={!S(totalEqualTo).isEmpty() ? replacer.id2Value(totalEqualTo) : null}
          />
        </td>
      );
    }
    return (
      <tr key={rowId} id={rowId}>
        <td className={classNames({ 'detail-shown': question.isRandom() && item.isRandomFixed() })}>
          {this.createItemDetail(item)}
          <div dangerouslySetInnerHTML={{ __html: replacer.id2Value(item.getLabel()) }} />
        </td>
        {subItems.map(subItem => (
          <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`}>
            <label>
              {MatrixQuestion.createInputElement(tableId, rowId, question, item, subItem)}
              {MatrixQuestion.createAdditionalInputElement(question, item, subItem)}
            </label>
          </td>))
        }
        {sumEl}
      </tr>
    );
  }

  createItemDetail(item) {
    const { question, options } = this.props;
    if (!options.isShowDetail()) return null;

    return (
      <div className="detail">
        {question.isRandom() && item.isRandomFixed() ? <span className="detail-function">ランダム固定</span> : null}
      </div>
    );
  }

  /** 描画 */
  render() {
    const { replacer, question, options } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const tableId = `${question.getId()}_table`;
    const items = question.getTransformedItems();
    const subItems = question.getTransformedSubItems();
    return (
      <div ref={(el) => { this.rootEl = el; }} className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replacer.id2Value(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Value(description) }} />}
        <div className="question">
          <table
            className={
              classNames('matrix group question-form-grid-table sdj-matrix',
                {
                  'sdj-sum-columns': question.isMatrixSumCols(),
                  'sdj-sum-rows': question.isMatrixSumRows(),
                  'sdj-group-rows': !question.isMatrixReverse(),
                  'sdj-group-columns': question.isMatrixReverse(),
                },
              )
            }
            id={tableId}
          >
            <thead>
              <tr>
                <td />
                {subItems.map(subItem => (
                  <td key={subItem.getId()} id={subItem.getId()} className={classNames({ 'detail-shown': question.isSubItemsRandom() && subItem.isRandomFixed() })}>
                    {this.createItemDetail(subItem)}
                    <div dangerouslySetInnerHTML={{ __html: replacer.id2Value(subItem.getLabel()) }} />
                  </td>
                ))}
                {question.getMatrixType() === 'number' && question.isMatrixSumRows() ? <td>合計</td> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item, itemIndex) => this.createRow(tableId, item, itemIndex, subItems, replacer))}
              {this.createSumColRow(question, subItems, replacer)}
            </tbody>
          </table>
        </div>
        { options.isShowDetail() ? (
          <QuestionDetail
            question={question}
            random
            subItemsRandom
            matrixReverse
          />) : null }
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(MatrixQuestion);



/* eslint-env browser */
import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import S from 'string';
import $ from 'jquery';
import classNames from 'classnames';
import TransformQuestion from './TransformQuestion';
import MatrixQuestionState from '../../states/MatrixQuestionState';
import QuestionDetail from '../parts/QuestionDetail';
import { isSP, convertVerticalWriting } from '../../../utils';

/** CheckboxQuestion, RadioQuestionの基底クラス */
class MatrixQuestion extends TransformQuestion {
  /** 列の合計行を作成する */
  constructor(props) {
    super(props, MatrixQuestionState);
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    // 縦書きをすると文字の長さによってはみ出してしまうブラウザがいるので、それに対する救済措置
    // firefoxやSafariではtdタグの直下のdivタグが縦書きになっていると、幅を正しく制御できない。
    // そのため、JavaScriptで明示的に要素の幅を指定することでバグを回避する。
    // なお、Chromeではこの減少は発生しない。
    // 縦書きのヘッダー項目を取得する
    const rootEl = ReactDOM.findDOMNode(this);
    const verticalElements = $(rootEl).find('.vertical-writing');
    let isExpand = false;
    verticalElements.each((i, el) => {
      const $el = $(el);
      const $td = $(el).closest('td');
      const verticalElementWidth = $el.width();
      // 親TD幅 < 縦書き定義div幅だったら、親のdiv幅に縦書き定義div幅を設定する
      if ($td.width() < verticalElementWidth) {
        isExpand = true;
        return false;
      }
    });
    // 幅調整する
    if (isExpand) {
      verticalElements.each((i, el) => {
        const $el = $(el);
        const $div = $(el).parent('div');
        const verticalElementWidth = $el.width();
        $div.css('width', `${verticalElementWidth}px`).css('display', 'inline-block');
      });
    }
  }

  getOutputName(question, item, subItem) {
    if (question.isMatrixReverse()) {
      return question.getOutputName(subItem, item);
    }
    return question.getOutputName(item, subItem);
  }

  /** 追加の入力elementを作成する */
  createAdditionalInputElement(question, item) {
    if (!item.hasAdditionalInput()) return null;

    const name = `${question.getId()}_value${item.getIndex() + 1}__text`;
    const requiredMessage = item.getAdditionalInputType() === 'number' ? '数値を入力してください' : '文字列を入力してください';
    const errorsContainerId = `${name}_errors_container`;
    const inputType = item.getAdditionalInputType();
    return (
      <span>
        <input
          type="text"
          pattern={inputType === 'number' ? '\\d*' : null}
          maxLength={inputType === 'number' ? 16 : 100}
          name={name}
          className={classNames('additional-input', { number: inputType === 'number' })}
          data-parsley-errors-container={`#${errorsContainerId}`}
          data-parsley-required
          data-parsley-required-message={requiredMessage}
          data-parsley-positive-integer={inputType === 'number' ? true : null}
        />
        {item.getUnit()}
        <span id={errorsContainerId} />
      </span>
    );
  }

  /** 数値の単位elementを作成する */
  createUnitLabelElementForNumber(question, item, subItem) {
    if (question.getMatrixType() !== 'number') return null;

    const targetItem = question.isMatrixReverse() ? item : subItem;
    return (
      <span className="numberUnitLabel">
        {targetItem.getUnit()}
      </span>
    );
  }

  /** 数値合計の単位elementを作成する */
  createUnitLabelElementForSumNumber(question, item) {
    if (question.getMatrixType() !== 'number') return null;

    return (
      <span className="numberUnitLabel">
        {item.getUnit()}
      </span>
    );
  }

  /** inputを作成する */
  createInputElement(tableId, rowId, question, item, subItem) {
    const { survey } = this.props;
    const matrixType = question.getMatrixType();
    const name = this.getOutputName(question, item, subItem);
    const value = question.isMatrixReverse() ? question.getOutputValue(item) : question.getOutputValue(subItem);
    switch (matrixType) {
      case 'radio': {
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;
        const errorsContainerId = this.getLabelId(question.isMatrixReverse() ? subItem : item);
        let errorMessage;
        if (isSP()) errorMessage = '必須';
        else errorMessage = `この${question.isMatrixReverse() ? '列' : '行'}の選択値を選択してください`;
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className="matrix-value"
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-errors-container={`#${errorsContainerId}`}
            data-parsley-required
            data-parsley-required-message={errorMessage}
          />
        );
      }
      case 'text': {
        return (
          <input
            type={matrixType}
            name={name}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
          />
        );
      }
      case 'number': {
        return (
          <input
            type="text"
            pattern="\d*"
            maxLength="16"
            name={name}
            className="sdj-numeric"
            size="4"
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-required
            data-parsley-positive-integer
          />
        );
      }
      case 'checkbox': {
        const multipleId = question.isMatrixReverse() ? subItem.getId() : item.getId();
        const exclusive = question.isMatrixReverse() ? item.isExclusive() : subItem.isExclusive();
        const classHandlerId = question.isMatrixReverse() ? subItem.getId() : rowId;
        const errorsContainerId = this.getLabelId(question.isMatrixReverse() ? subItem : item);
        return (
          <input
            type={matrixType}
            name={name}
            value={value}
            className={classNames('matrix-value', { exclusive })}
            data-output-no={survey.findOutputNoFromName(name)}
            data-parsley-class-handler={`#${classHandlerId}`}
            data-parsley-errors-container={`#${errorsContainerId}`}
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

  /** ラベルのIDを返すする */
  getLabelId(item) {
    return `${item.getId()}_label`;
  }

  /** 列の合計値エリアを構築する */
  createSumColRow(question, items, replacer) {
    const { survey, runtime, options } = this.props;
    if (question.getMatrixType() === 'number' && question.isMatrixSumCols()) {
      return (
        <tr data-row-order="total">
          <td>合計</td>
          {
            items.map((item) => {
              const totalName = question.getOutputTotalColName(item);
              const colId = `${question.getId()}_${item.getId()}_sum`;
              const columnClassName = classNames({
                [item.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
              });
              return (
                <td key={colId} className={columnClassName}>
                  <label>
                    <input
                      name={totalName}
                      className="sdj-sum disabled"
                      type="text"
                      readOnly
                      size="4"
                      defaultValue="0"
                      data-output-no={survey.findOutputNoFromName(totalName)}
                      data-parsley-required
                      data-parsley-positive-integer
                    />
                    {this.createUnitLabelElementForSumNumber(question, item)}
                  </label>
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
    const { survey, runtime, options, question } = this.props;
    const rowId = `${question.getId()}_${item.getId()}`;
    const totalName = question.getOutputTotalRowName(item);
    const showChooseSpan = ['radio', 'checkbox'].includes(question.getMatrixType());
    let sumEl = null;

    const rowClassName = classNames({
      [item.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
    });

    // 行の合計値表示
    if (question.getMatrixType() === 'number' && question.isMatrixSumRows()) {
      sumEl = (
        <td>
          <label>
            <input
              name={totalName}
              className="sdj-sum disabled"
              type="text"
              readOnly
              size="4"
              defaultValue="0"
              data-output-no={survey.findOutputNoFromName(totalName)}
              data-parsley-required
              data-parsley-positive-integer
            />
            {this.createUnitLabelElementForSumNumber(question, item)}
          </label>
        </td>
      );
    }
    return (
      <tr key={rowId} id={rowId} className={rowClassName} data-row-order={item.getIndex() + 1}>
        <td className={classNames({ 'detail-shown': question.isRandom() && item.isRandomFixed() })}>
          {this.createItemDetail(item)}
          {
            question.isMatrixReverse() ? <span dangerouslySetInnerHTML={{ __html: replacer.id2Span(item.getLabel()) }} /> :
            <span id={this.getLabelId(item)} dangerouslySetInnerHTML={{ __html: replacer.id2Span(item.getLabel()) }} />
          }
          {this.createAdditionalInputElement(question, item)}
        </td>
        {subItems.map((subItem) => {
          const columnClassName = classNames({
            [subItem.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
          });

          return (
            <td key={`${question.getId()}_${item.getId()}_${subItem.getId()}`} className={columnClassName}>
              <label>
                {this.createInputElement(tableId, rowId, question, item, subItem)}
                {showChooseSpan && <span className="select-tool check-not-text" />}
                {this.createUnitLabelElementForNumber(question, item, subItem)}
              </label>
            </td>
          );
        })}
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
    const { survey, runtime, replacer, question, options } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const tableId = `${question.getId()}_table`;
    const items = this.state.model.getTransformedItems();
    const subItems = this.state.model.getTransformedSubItems();
    return (
      <div className={this.constructor.name}>
        {S(title).isEmpty() ? null : <h2 className="question-title" data-dev-id-label={question.getDevId()} dangerouslySetInnerHTML={{ __html: replacer.id2Span(title) }} />}
        {S(description).isEmpty() ?
          null : <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Span(description) }} />}
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
                {subItems.map((subItem) => {
                  const columnClassName = classNames({
                    'detail-shown': question.isSubItemsRandom() && subItem.isRandomFixed(),
                    [subItem.calcVisibilityClassName(survey, runtime.getAnswers())]: !options.isVisibilityConditionDisabled(),
                    'col-vertical-writing': question.isMatrixColVerticalWriting(),
                  });
                  const innerColumnClassName = classNames({
                    'vertical-writing': question.isMatrixColVerticalWriting(),
                  });
                  return (
                    <td key={subItem.getId()} id={subItem.getId()} className={columnClassName} data-col-order={subItem.getIndex() + 1}>
                      {this.createItemDetail(subItem)}
                      {
                        // AndroidやiOSにおける縦書き時のはみ出し対応のため親divタグを定義している。
                        question.isMatrixReverse() ? <div><div id={this.getLabelId(subItem)} className={innerColumnClassName} dangerouslySetInnerHTML={{ __html: replacer.id2Span(subItem.getLabel()) }} /></div> :
                        <div><div className={innerColumnClassName} dangerouslySetInnerHTML={{ __html: replacer.id2Span(convertVerticalWriting(innerColumnClassName, subItem.getLabel())) }} /></div>
                      }
                      {this.createAdditionalInputElement(question, subItem)}
                    </td>
                  );
                })}
                {question.getMatrixType() === 'number' && question.isMatrixSumRows() ? <td data-col-order="total">合計</td> : null}
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

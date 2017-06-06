/* eslint-env browser */
import React from 'react';
import { connect } from 'react-redux';
import S from 'string';
import classNames from 'classnames';
import { parseInteger } from '../../../utils';
import TransformQuestion from './TransformQuestion';
import MultiNumberQuestionState from '../../states/MultiNumberQuestionState';
import ItemDefinition from '../../models/survey/questions/internal/ItemDefinition';
import QuestionDetail from '../parts/QuestionDetail';
import * as Actions from '../../actions';

/** 設問：数値記入 */
class MultiNumberQuestion extends TransformQuestion {
  constructor(props) {
    super(props, MultiNumberQuestionState);
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    this.rootEl.addEventListener('change', () => this.setTotalValue(), false);
    this.rootEl.addEventListener('keyup', () => this.setTotalValue(), false);
  }

  /** 入力値をもとに合計値を設定する */
  setTotalValue() {
    const { question, executeNextTick } = this.props;
    const idList = this.state.model.getTransformedItems().map(item => question.getOutputName(false, item.getIndex())).toList();
    const doc = this.rootEl.ownerDocument;
    // totalElを更新する前に次のページに遷移してしまう可能性があるため、executingフラグをtrueにすることで「進む」ボタンを押せないようにする
    executeNextTick(() => {
      // sdj-numericが全角を半角にした後に計算する必要があるため、setTimeoutしてnextTickで処理を行う
      const total = idList.reduce((reduction, id) => reduction + parseInteger(doc.getElementById(id).value, 0), 0);

      const totalId = question.getOutputName(true);
      const totalEl = doc.getElementById(totalId);
      if (totalEl) {
        totalEl.value = total;
      }
    }, true);
  }

  /** 制御情報を作成する */
  createItemDetail(item) {
    const { options, question } = this.props;
    if (!options.isShowDetail()) return null;

    if (!question.isRandom() || !item.isRandomFixed()) return null;
    return (
      <span className="detail-function" style={{ verticalAlign: 'top' }}>ランダム固定</span>
    );
  }

  /** itemに対応するelementを作成する */
  createItem(item, isTotal = false) {
    const { survey, runtime, options, replacer, question } = this.props;
    const name = question.getOutputName(isTotal, item.getIndex());
    const totalEqualTo = question.getTotalEqualTo();
    const errorContainerId = `${name}_error_container`;

    const className = classNames('multiNumberLine', {
      multiNumberTotal: isTotal,
      [item.calcVisibilityClassName(survey, runtime.getAnswers(true))]: !options.isVisibilityConditionDisabled(),
    });

    return (
      <div key={`${question.getId()}_${item.getIndex()}`} className={className}>
        <div className="multiNumberLabel">
          <label dangerouslySetInnerHTML={{ __html: replacer.id2Value(item.getLabel()) }} />
        </div>
        <div className="multiNumberAssociated mini">
          <div className="multiNumberInput">
            <input
              type="text"
              pattern="\d*"
              maxLength="16"
              id={name}
              name={name}
              className={classNames('sdj-numeric', { disabled: isTotal })}
              readOnly={isTotal}
              data-output-no={survey.findOutputNoFromName(name)}
              data-response-multiple
              data-response-item-index={isTotal ? null : item.getIndex()}
              data-parsley-required={!isTotal}
              data-parsley-type="digits"
              data-parsley-min={isTotal || S(question.getMin()).isEmpty() ? null : replacer.id2Value(question.getMin())}
              data-parsley-max={isTotal || S(question.getMax()).isEmpty() ? null : replacer.id2Value(question.getMax())}
              data-parsley-equal={isTotal && !S(totalEqualTo).isEmpty() ? replacer.id2Value(totalEqualTo) : null}
              data-parsley-errors-container={`#${errorContainerId}`}
            />
            <span className="multiNumberUnit"> {question.getUnit()}</span>
            <span id={errorContainerId} />
          </div>
        </div>
        {this.createItemDetail(item)}
      </div>
    );
  }

  /** itemsに対応するelementを作成する */
  createItems() {
    const { model } = this.state;
    const items = model.getTransformedItems();
    if (items.size === 0) {
      throw new Error('items attribute is not defined');
    }
    return items.map(item => this.createItem(item));
  }

  /** 合計のelementを作成する */
  createTotalItem() {
    const { question } = this.props;
    if (!question.isShowTotal()) {
      return null;
    }
    return this.createItem(new ItemDefinition({ label: '合計' }), true);
  }

  render() {
    const { replacer, question, options } = this.props;
    const title = question.getTitle();
    const description = question.getDescription();
    const answers = {};
    return (
      <div ref={(el) => { this.rootEl = el || this.rootEl; }} className={this.constructor.name}>
        <h2 className="question-title" dangerouslySetInnerHTML={{ __html: replacer.id2Value(title, answers) }} />
        <h3 className="question-description" dangerouslySetInnerHTML={{ __html: replacer.id2Value(description, answers) }} />
        <div className="question validation-hover-target">
          {this.createItems()}
          {this.createTotalItem()}
        </div>
        { options.isShowDetail() ? <QuestionDetail question={question} random min max totalEqualTo={question.isShowTotal()} /> : null }
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

const actionsToProps = dispatch => ({
  executeNextTick: func => Actions.executeNextTick(dispatch, func),
});

export default connect(
  stateToProps,
  actionsToProps,
)(MultiNumberQuestion);

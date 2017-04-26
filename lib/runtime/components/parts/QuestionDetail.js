/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Value from './Value';

/** プレビューのためのコンテナ */
class QuestionDetail extends Component {
  createOptions() {
    const { question, random, subItemsRandom, matrixReverse } = this.props;
    return (
      <div className="display-control">
        表示制御
        <table>
          <tbody>
            {
              random ?
                <tr>
                  <td>{random === true ? 'ランダム' : random}</td>
                  <td>{question.isRandom() ? '◯' : null}</td>
                </tr> : null
            }
            {
              subItemsRandom ?
                <tr>
                  <td>列ランダム</td>
                  <td>{question.isSubItemsRandom() ? '◯' : null}</td>
                </tr> : null
            }
            {
              matrixReverse ?
                <tr>
                  <td>列でグルーピング</td>
                  <td>{question.isMatrixReverse() ? '◯' : null}</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    );
  }
  createValidations() {
    const { question, min, max, totalEqualTo, minCheckCount, maxCheckCount } = this.props;
    if (!(min || max || totalEqualTo || minCheckCount || maxCheckCount)) return null;
    return (
      <div className="validation">
        入力値制限
        <table>
          <tbody>
            {
              min ?
                <tr>
                  <td>最小値</td>
                  <td><Value value={question.getMin()} /></td>
                </tr> : null
            }
            {
              max ?
                <tr>
                  <td>最大値</td>
                  <td><Value value={question.getMax()} /></td>
                </tr> : null
            }
            {
              totalEqualTo ?
                <tr>
                  <td>合計値</td>
                  <td><Value value={question.getTotalEqualTo()} /></td>
                </tr> : null
            }
            {
              minCheckCount ?
                <tr>
                  <td>最低選択数</td>
                  <td>{question.getMinCheckCount()}</td>
                </tr> : null
            }
            {
              maxCheckCount ?
                <tr>
                  <td>最大選択数</td>
                  <td>{question.getMaxCheckCount()}</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    );
  }
  render() {
    return (
      <div className="question-detail">
        {this.createOptions()}
        {this.createValidations()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

export default connect(
  stateToProps,
)(QuestionDetail);

import { Component } from 'react';

/**
 * ラベルを変換したり、順序を変更するような変換が必要な設問のベースクラス
 */
export default class TransformQuestion extends Component {
  constructor(props, StateModel, inputType) {
    super(props);
    this.StateModel = StateModel;
    this.inputType = inputType;

    // stateが変わるたびに順序が異なると困るのでitemsをtransformしておく
    this.state = this.createInitialModel(props);
  }

  /** Reactのライフサイクルメソッド */
  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみitemsをtransformしておく
      this.setState(this.createInitialModel(nextProps));
    }
  }

  /** modelを初期化する */
  createInitialModel(props) {
    return { model: new this.StateModel(props.question, props.options.isDisableTransformQuestion()) };
  }
}

import { Component } from 'react';

/**
 * ラベルを変換したり、順序を変更するような変換が必要な設問のベースクラス
 */
export default class TransformQuestion extends Component {
  constructor(props, StateModel, inputType) {
    super(props);
    this.StateModel = StateModel;
    this.inputType = inputType;

    this.state = {
      // stateが変わるたびに順序が異なると困るのでitemsをtransformしておく
      model: new this.StateModel(this.props.question),
    };
  }

  /** Reactのライフサイクルメソッド */
  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみitemsをtransformしておく
      this.setState({
        model: new this.StateModel(nextProps.question),
      });
    }
  }
}

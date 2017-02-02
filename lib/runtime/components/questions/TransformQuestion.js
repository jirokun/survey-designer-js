import { Component } from 'react';
import { Map } from 'immutable';

const DEFAULT_CHECKBOX_STATE = { value: null, checked: false, disabled: false };

/**
 * ラベルを変換したり、順序を変更するような変換が必要な設問のベースクラス
 */
export default class TransformQuestion extends Component {
  constructor(props, StateModel, inputType) {
    super(props);
    this.inputType = inputType;
    this.StateModel = StateModel;
    const transformedChoices = props.question.getTransformedChoices();
    const itemState = transformedChoices.map(() => Map(DEFAULT_CHECKBOX_STATE)).toList();
    this.state = {
      // stateが変わるたびに順序が異なると困るのでchoicesをtransformしておく
      model: new this.StateModel({ transformedChoices, itemState }),
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      const transformedChoices = nextProps.question.getTransformedChoices();
      const itemState = transformedChoices.map(() => Map(DEFAULT_CHECKBOX_STATE)).toList();
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみchoicesをtransformしておく
      this.setState({
        model: new this.StateModel({ transformedChoices, itemState }),
      });
    }
  }
}

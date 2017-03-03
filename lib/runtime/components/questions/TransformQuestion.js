import { Component } from 'react';
import { Map, Repeat } from 'immutable';

const DEFAULT_CHECKBOX_STATE = { value: null, checked: false, disabled: false };

/**
 * ラベルを変換したり、順序を変更するような変換が必要な設問のベースクラス
 */
export default class TransformQuestion extends Component {
  constructor(props, StateModel) {
    super(props);
    this.StateModel = StateModel;
    const transformedItems = props.question.getTransformedItems();
    const itemState = Repeat(Map(DEFAULT_CHECKBOX_STATE), transformedItems.size).toList();

    this.state = {
      // stateが変わるたびに順序が異なると困るのでitemsをtransformしておく
      model: new this.StateModel({ transformedItems, itemState }),
    };
  }

  /** Reactのライフサイクルメソッド */
  componentWillUpdate(nextProps) {
    if (this.props.question !== nextProps.question) {
      const transformedItems = nextProps.question.getTransformedItems();
      const itemState = transformedItems.map(() => Map(DEFAULT_CHECKBOX_STATE)).toList();
      // stateが変わるたびに順序が異なると困るので
      // propsが変わったタイミンでのみitemsをtransformしておく
      this.setState({
        model: new this.StateModel({ transformedItems, itemState }),
      });
    }
  }
}

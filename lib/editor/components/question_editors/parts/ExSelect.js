import React from 'react';
import { List } from 'immutable';

/** 渡されたchildrenからフラットなobjectを生成する */
function childrenToObject(children) {
  return List(children).flatMap((option) => {
    // 配列が渡ってくることも有る
    if (Array.isArray(option)) {
      return List(option.map(childOption => ({ label: childOption.props.children, value: childOption.props.value })));
    }
    const optionProps = option.props;
    return [{ label: optionProps.children, value: optionProps.value }];
  }).toArray();
}

/**
 * select表示とプレーンテキスト表示を簡単に切り替えるためのコンポーネント
 */
export default function ExSelect(props) {
  const { detailMode } = props;

  if (detailMode) {
    const values = childrenToObject(props.children);
    if (props.value === '') return <span className="alert-value">未選択</span>;
    const selectedObj = values.find(obj => obj.value === props.value);
    return <span className="fixed-value">{selectedObj.label}</span>;
  }
  // detailModeは渡さない
  const passProps = Object.assign({}, props);
  delete passProps.detailMode;
  return (
    <select {...passProps}>
      {props.children}
    </select>
  );
}

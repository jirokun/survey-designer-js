import React from 'react';
import { List } from 'immutable';
import S from 'string';

/** 渡されたchildrenからフラットなobjectを生成する */
function childrenToObject(children) {
  return List(children).filter(option => !!option).flatMap((option) => {
    // childrenが多重配列で渡ってくることも有る
    if (Array.isArray(option)) {
      return List(option.map(childOption => (
        {
          label: childOption.props.children,
          value: childOption.props.value,
          error: !!childOption.props.error,
        }
      )));
    }
    const optionProps = option.props;
    return [{ label: optionProps.children, value: optionProps.value, error: !!optionProps.error }];
  }).toArray();
}

/**
 * select表示とプレーンテキスト表示を簡単に切り替えるためのコンポーネント
 */
export default function ExSelect(props) {
  const { detailMode, notExistsLabel } = props;

  const values = childrenToObject(props.children);
  const selectedObj = values.find(obj => obj.value === props.value);
  if (detailMode) {
    if (!selectedObj) return <span className="alert-value" title={notExistsLabel || '未選択'}>{notExistsLabel || '未選択'}</span>;
    const label = S(selectedObj.label).isEmpty() ? '未選択' : selectedObj.label;
    if (selectedObj['data-error']) return <span className="alert-value" title={label}>{label}</span>;
    return <span className="fixed-value" title={label}>{label}</span>;
  }

  // detailModeは渡さない
  const passProps = Object.assign({}, props);
  delete passProps.detailMode;
  delete passProps.notExistsLabel;
  if (notExistsLabel && !selectedObj) passProps.value = 'notExists';
  return (
    <select {...passProps}>
      { notExistsLabel && !selectedObj ? <option value="notExists">{notExistsLabel}</option> : null }
      {props.children}
    </select>
  );
}

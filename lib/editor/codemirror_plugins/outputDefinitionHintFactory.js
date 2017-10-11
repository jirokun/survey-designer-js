/* eslint-env browser */
import CodeMirror from 'codemirror';

export default function outputDefinitionHintFactory(overrideOptions = {}) {
  // どの項目をオートコンプリートするか
  const defaultOptions = {
    dev: true,
    no: true,
    name: true,
    form: true,
    reprint: true,
  };

  const options = Object.assign(defaultOptions, overrideOptions);

  return function outputDefinitionHint(survey, cm) {
    const cur = cm.getCursor();
    const line = cm.getLine(cur.line);

    // OutputNoのlistを作る
    const list = [];

    // 文字以外の箇所で一度区切る
    const beforeString = line.substring(0, cur.ch).split(/[^:-\w]/).pop();
    // dev:, no:, name:, form:のいずれかにマッチするか確認
    const m = beforeString.match(/(\b(?:[^ ]+)\b)/);
    if (!m) return { list, from: 0, to: 0 };
    const start = line.lastIndexOf(m[1]);
    const end = start + m[1].length;
    const from = CodeMirror.Pos(cur.line, start);
    const to = CodeMirror.Pos(cur.line, end);

    survey.getAllOutputDefinitions().forEach((od) => {
      if (options.dev) list.push({ displayText: `dev:${od.getOutputNo()} ${od.getLabel()}`, text: od.getDevId() });
      if (options.no) list.push({ displayText: `no:${od.getOutputNo()} ${od.getLabel()}`, text: od.getOutputNo() });
      if (options.name) list.push({ displayText: `name:${od.getOutputNo()} ${od.getLabel()}`, text: od.getName() });

      if (options.reprint) {
        const propertyName = od.getOutputType() === 'checkbox' || od.isOutputTypeSingleChoice() ? 'answer_label' : 'answer';
        list.push({ displayText: `reprint:${od.getOutputNo()} ${od.getLabel()}`, text: `{{${od.getOutputNo()}.${propertyName}}}` });
      }

      if (options.form) {
        if (od.getOutputType() === 'checkbox') {
          list.push({
            displayText: `form:${od.getOutputNo()} ${od.getLabel()}`,
            text: `<input type="checkbox" name="${od.getName()}" id="${od.getName()}" value="1" />`,
          });
        } else if (od.getOutputType() === 'radio') {
          od.getChoices().forEach((choice) => {
            list.push({
              displayText: `form:${od.getOutputNo()}(${choice.getValue()}) ${od.getLabel()}`,
              text: `<input type="radio" name="${od.getName()}" value="${choice.getValue()}" />`,
            });
          });
        } else {
          list.push({ displayText: `form:${od.getOutputNo()} ${od.getLabel()}`, text: `<input type="text" name="${od.getName()}" />` });
        }
      }
    });
    return { list: list.filter(obj => obj.displayText.indexOf(m[1]) !== -1), from, to };
  };
}


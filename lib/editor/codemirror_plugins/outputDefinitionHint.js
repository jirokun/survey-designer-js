/* eslint-env browser */
import CodeMirror from 'codemirror';

export default function outputpDefinitionHint(survey, cm) {
  const cur = cm.getCursor();
  const line = cm.getLine(cur.line);

  // OutputNoのlistを作る
  const list = [];

  // 文字以外の箇所で一度区切る
  const beforeString = line.substring(0, cur.ch).split(/[^:-\w]/).pop();
  // dev:, no:, name:, form:のいずれかにマッチするか確認
  const m = beforeString.match(/(\b(?:dev|no|name|form):[^ ]*)$/);
  if (!m) return { list, from: 0, to: 0 };
  const start = line.lastIndexOf(m[1]);
  const end = start + m[1].length;
  const from = CodeMirror.Pos(cur.line, start);
  const to = CodeMirror.Pos(cur.line, end);

  survey.getAllOutputDefinitions().forEach((od) => {
    list.push({ displayText: `dev:${od.getDevId()} ${od.getLabel()}`, text: od.getDevId() });
    list.push({ displayText: `no:${od.getOutputNo()} ${od.getLabel()}`, text: od.getOutputNo() });
    list.push({ displayText: `name:${od.getName()} ${od.getLabel()}`, text: od.getName() });
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
  });
  return { list: list.filter(obj => obj.displayText.indexOf(m[1]) !== -1), from, to };
}


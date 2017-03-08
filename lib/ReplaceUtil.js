import S from 'string';

export default class ReplaceUtil {
  /**
   * コンストラクタ
   *
   * @param {Object} allOutputDefinitionMap 出力定義
   * @param {Object} questionNoMap Question番号からoutputのnameを引くためのオブジェクト
   * @param {Object} answers answerのオブジェクト。
   */
  constructor(allOutputDefinitionMap, questionNoMap, answers) {
    this.allOutputDefinitionMap = allOutputDefinitionMap;
    this.questionNoMap = questionNoMap;
    this.answers = answers;
  }

  /**
   * 再掲のための文字列置換を行う
   *
   * 形式は下記の通り
   * ${<outputName>#<answer|label|value>}
   * 例:
   *   ${cizxhx0wb00013j5z5kq89wii#answer} => ユーザの回答データ
   *   ${cizxhx0wb00013j5z5kq89wii#label} => 設問のラベル(plainLabel)
   *   ${cizxhx0wb00013j5z5kq89wii#value} => 設問の値
   *
   * 全体としての置換処理
   * 各エディタでもQuestionの変換機能を有しているため、ユーザは画面上下記のように入力する。
   *   ${1-1-1#answer}
   * この入力はエディタ側で下記のように変換され、surveyの定義として保存される。
   *   ${cizxhx0wb00013j5z5kq89wii#answer}
   * 上記の内容は最終的にユーザの入力値に変換される
   *   あいうえお
   * この関数では ${cizxhx0wb00013j5z5kq89wii#answer} から あいうえお への変換を担当する。
   */
  name2Value(str) {
    let index = 0;
    let oldIndex;
    let isInVariable = false;
    let variableStartIndex;
    let variableEndIndex;
    let ret = '';
    if (!str) {
      return ret;
    }
    for (;;) {
      oldIndex = index;
      if (!isInVariable) {
        index = str.indexOf('${', index);
        if (index === -1) {
          ret += str.substring(oldIndex);
          break;
        }
        if (str[index - 1] === '\\') {
          ret += str.substring(oldIndex, index - 1);
          ret += str[index];
          index++;
        } else {
          ret += str.substring(oldIndex, index);
          isInVariable = true;
          variableStartIndex = index + 2;
          index++;
        }
      } else {
        index = str.indexOf('}', index);
        if (index === -1) {
          ret += str.substring(oldIndex);
          break;
        }
        if (str[index - 1] === '\\') {
          index++;
          ret += str.substring(oldIndex, index);
        } else {
          isInVariable = false;
          variableEndIndex = index;
          const variable = str.substring(variableStartIndex, variableEndIndex);
          const match = variable.match(/^(\w+)#(\w+)$/);
          if (!match) {
            index++;
            continue;
          }
          const name = match[1];
          const prop = match[2];
          const od = this.allOutputDefinitionMap.find(e => e.getName() === name);
          if (!od) {
            index++;
            continue;
          }
          switch (prop) {
            case 'answer':
              ret += this.answers[name];
              break;
            case 'label':
              ret += od.label;
              break;
            default:
              ret += 'ERROR 参照した値がありません';
              break;
          }
          index++;
        }
      }
    }
    return ret;
  }

  /**
   * 再掲のための文字列置換を行う。
   *
   * 主にエディタで使用されることを想定している
   * ${1-1-1#value}という表現を${cizxomo8f00033j5zz2nt9kvg#value}という表現に置換する。
   */
  outputNo2Name(str) {
    let encodedStr = str.toString();
    for (const key in this.questionNoMap) {
      if (!Object.prototype.hasOwnProperty.call(this.questionNoMap, key)) continue;
      const pattern = new RegExp(`\\$\\{(${key})#(\\w+)\\}`, 'g');
      encodedStr = encodedStr.replace(pattern, (match, questionNo, prop) => {
        const questionName = this.questionNoMap[questionNo];
        return `\${${questionName}#${prop}}`;
      });
    }
    return encodedStr;
  }

  /**
   * outputNo2Nameの逆を行う
   */
  name2OutputNo(str) {
    let encodedStr = str.toString();
    this.allOutputDefinitionMap.forEach((value, key) => {
      const od = this.allOutputDefinitionMap.get(key);
      const pattern = new RegExp(`\\$\\{(${od.getName()})#(\\w+)\\}`, 'g');
      encodedStr = encodedStr.replace(pattern, (match, questionNo, prop) => `\${${od.getOutputNo()}#${prop}}`);
    });
    return encodedStr;
  }
}

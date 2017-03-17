import S from 'string';

export default class ReplaceUtil {
  static convert(str, dictionary) {
    if (typeof str !== 'string') return str;
    let result = str;
    for (const key in dictionary) {
      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) continue;
      result = result.replace(`{{${key}}}`, dictionary[key]);
    }
    return result;
  }

  static createOutputNo2NameParams(questionNoMap) {
    const params = {};
    for (const key in questionNoMap) {
      if (!Object.prototype.hasOwnProperty.call(questionNoMap, key)) continue;
      params[`${key}.answer`] = `{{${questionNoMap[key]}.answer}}`;
      params[`${key}.label`] = `{{${questionNoMap[key]}.label}}`;
    }
    return params;
  }

  static createName2OutputNoParams(allOutputDefinitionMap) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      params[`${od.getName()}.answer`] = `{{${od.getOutputNo()}.answer}}`;
      params[`${od.getName()}.label`] = `{{${od.getOutputNo()}.label}}`;
    });
    return params;
  }

  static createName2ValueParams(allOutputDefinitionMap, answers) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      params[`${od.getName()}.answer`] = answers[od.getName()];
      params[`${od.getName()}.label`] = od.getLabel();
      const choices = od.getChoices();
      if (choices === null) return;
      choices.forEach((choice) => {
        params[`${od.getName()}.choice.${choice.getId()}.label`] = choice.getLabel();
        params[`${od.getName()}.choice.${choice.getId()}.value`] = choice.getValue();
      });
    });
    return params;
  }

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

    this.name2ValueParams = ReplaceUtil.createName2ValueParams(allOutputDefinitionMap, answers);
    this.name2OutputNoParams = ReplaceUtil.createName2OutputNoParams(allOutputDefinitionMap);
    this.outputNo2NameParams = ReplaceUtil.createOutputNo2NameParams(questionNoMap);
  }

  /**
   * 再掲のための文字列置換を行う
   *
   * 形式は下記の通り
   * ${<outputName>.<answer|label|value>}
   * ${<outputName>.choices.<itemId>.<label|value>}
   * 例:
   *   ${cizxhx0wb00013j5z5kq89wii.answer} => ユーザの回答データ
   *   ${cizxhx0wb00013j5z5kq89wii.label} => 設問のラベル(plainLabel)
   *   ${cizxhx0wb00013j5z5kq89wii.choice.aeajlg0bc02224a5b5ke2ewwo.label} => 設問のラベル
   *   ${cizxhx0wb00013j5z5kq89wii.choice.aeajlg0bc02224a5b5ke2ewwo.value} => 設問の値
   *
   * 全体としての置換処理
   * 各エディタでもQuestionの変換機能を有しているため、ユーザは画面上下記のように入力する。
   *   ${1-1-1.answer}
   * この入力はエディタ側で下記のように変換され、surveyの定義として保存される。
   *   ${cizxhx0wb00013j5z5kq89wii.answer}
   * 上記の内容は最終的にユーザの入力値に変換される
   *   あいうえお
   * この関数では ${cizxhx0wb00013j5z5kq89wii.answer} から あいうえお への変換を担当する。
   */
  name2Value(str) {
    return ReplaceUtil.convert(str, this.name2ValueParams);
  }

  /**
   * 再掲のための文字列置換を行う。
   *
   * 主にエディタで使用されることを想定している
   * ${1-1-1.value}という表現を${cizxomo8f00033j5zz2nt9kvg.value}という表現に置換する。
   */
  outputNo2Name(str) {
    return ReplaceUtil.convert(str, this.outputNo2NameParams);
  }

  /**
   * outputNo2Nameの逆を行う
   */
  name2OutputNo(str) {
    return ReplaceUtil.convert(str, this.name2OutputNoParams);
  }

  /** 参照のnameが含まれているかどうかをチェックする */
  isIncludeName(str) {
    return this.name2OutputNo(str) !== str;
  }
}

import S from 'string';

export default class Replacer {
  static convert(str, dictionary) {
    if (typeof str !== 'string') return str;
    let result = str;
    for (const key in dictionary) {
      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) continue;
      for (;;) {
        // 値が変化しなくなるまで繰り返す
        const old = result;
        result = result.replace(key, dictionary[key]);
        if (result === old) break;
      }
    }
    return result;
  }

  static createIdNoParams(allOutputDefinitionMap, reverse) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      const key1 = `{{${od.getId()}.answer}}`;
      const key2 = `{{${od.getId()}.label}}`;
      const value1 = `{{${od.getOutputNo()}.answer}}`;
      const value2 = `{{${od.getOutputNo()}.label}}`;
      if (reverse) {
        params[value1] = key1;
        params[value2] = key2;
      } else {
        params[key1] = value1;
        params[key2] = value2;
      }
    });
    return params;
  }

  static createId2NameParams(allOutputDefinitionMap) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      params[`{{${od.getId()}.answer}}`] = `{{${od.getName()}}.answer}}`;
      params[`{{${od.getId()}.label}}`] = `{{${od.getName()}}.label}}`;
    });
    return params;
  }

  static createId2ValueParams(allOutputDefinitionMap, answers) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      params[`{{${od.getId()}.answer}}`] = answers[od.getName()];
      params[`{{${od.getId()}.label}}`] = od.getLabel();
      const choices = od.getChoices();
      if (choices === null) return;
      choices.forEach((choice) => {
        params[`{{${od.getId()}.choice.${choice.getId()}.label}}`] = choice.getLabel();
        params[`{{${od.getId()}.choice.${choice.getId()}.value}}`] = choice.getValue();
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
  constructor(allOutputDefinitionMap, answers) {
    this.allOutputDefinitionMap = allOutputDefinitionMap;
    this.answers = answers;

    this.id2NoParams = Replacer.createIdNoParams(allOutputDefinitionMap, false);
    this.no2IdParams = Replacer.createIdNoParams(allOutputDefinitionMap, true);
    this.id2NameParams = Replacer.createId2NameParams(allOutputDefinitionMap);
    this.id2ValueParams = Replacer.createId2ValueParams(allOutputDefinitionMap, answers);
  }

  /**
   * 再掲のための文字列置換を行う
   *
   * 形式は下記の通り
   * ${<outputId>.<answer|label|value>}
   * ${<outputId>.choices.<itemId>.<label|value>}
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
  id2Value(str) {
    return Replacer.convert(str, this.id2ValueParams);
  }

  /** id表現の置換文字列をName表現に変換する */
  id2Name(str) {
    return Replacer.convert(str, this.id2NameParams);
  }

  /**
   * 再掲のための文字列置換を行う。
   *
   * 主にエディタで使用されることを想定している
   * ${1-1-1.value}という表現を${cizxomo8f00033j5zz2nt9kvg.value}という表現に置換する。
   */
  no2Id(str) {
    return Replacer.convert(str, this.no2IdParams);
  }

  /**
   * no2Idの逆を行う
   */
  id2No(str) {
    return Replacer.convert(str, this.id2NoParams);
  }

  /** 参照のnameが含まれているかどうかをチェックする */
  isIncludeName(str) {
    return this.id2No(str) !== str;
  }

  /** 参照している値が正しいかチェックする */
  validate(str) {
    const regexp = /{{([^.]+)\.(label|answer|value|(choice)\.([^.]+)\.(label|value))}}/g;
    let m;
    for (;;) {
      m = regexp.exec(str);
      if (m === null) break;
      // 存在している参照かどうかを確かめる
      const key = `{{${m[1]}.${m[2]}}}`;
      if (!(key in this.id2ValueParams)) {
        return false;
      }
    }
    return true;
  }
}

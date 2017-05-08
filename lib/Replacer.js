import S from 'string';

export default class Replacer {
  static convert(str, dictionary) {
    if (typeof str !== 'string') return str;
    let result = str;
    for (const key in dictionary) {
      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) continue;
      for (;;) {
        // 値が変化しなくなるまで繰り返す
        // 置換後の文字列にさらに置換文字列が入っていると、dictionaryの順番的に再置換されることもあるが
        // そこまで対応すると難しくなるので対応しない
        const old = result;
        result = result.replace(key, dictionary[key]);
        if (result === old) break;
      }
    }
    return result;
  }

  static createId2NoParams(allOutputDefinitionMap, reverse) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      const key1 = `{{${od.getId()}.answer}}`;
      const key2 = `{{${od.getId()}.answer_label}}`;
      const value1 = `{{${od.getOutputNo()}.answer}}`;
      const value2 = `{{${od.getOutputNo()}.answer_label}}`;
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
    });
    return params;
  }

  static createId2ValueParams(allOutputDefinitionMap, answers, forEdit) {
    const params = {};
    allOutputDefinitionMap.forEach((od) => {
      const answerValue = answers[od.getName()] === undefined ? '' : answers[od.getName()];
      params[`{{${od.getId()}.answer}}`] = forEdit ? `<span class="answer-value">再掲 ${od.getOutputNo()}</span>` : answerValue;
      const type = od.getOutputType();
      if (type === 'checkbox') {
        if (forEdit) {
          params[`{{${od.getId()}.answer_label}}`] = `<span class="answer-value">再掲 ${od.getOutputNo()}</span>`;
        } else {
          params[`{{${od.getId()}.answer_label}}`] = od.getLabel();
        }
      } else if (type === 'radio' || type === 'select') {
        const selectedChoice = od.getChoices().find(choice => choice.getValue() === answerValue);
        od.getChoices().forEach((choice) => {
          // choice用
          params[`{{${choice.getId()}.choice_value}}`] = choice.getValue();
        });
        if (forEdit) {
          params[`{{${od.getId()}.answer_label}}`] = `<span class="answer-value">再掲 ${od.getOutputNo()}</span>`;
        } else {
          params[`{{${od.getId()}.answer_label}}`] = selectedChoice ? selectedChoice.getLabel() : '';
        }
      }
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
  constructor(allOutputDefinitionMap, answers, forEdit) {
    this.allOutputDefinitionMap = allOutputDefinitionMap;
    this.answers = answers;

    this.id2NoParams = Replacer.createId2NoParams(allOutputDefinitionMap, false);
    this.no2IdParams = Replacer.createId2NoParams(allOutputDefinitionMap, true);
    this.id2NameParams = Replacer.createId2NameParams(allOutputDefinitionMap);
    this.id2ValueParams = Replacer.createId2ValueParams(allOutputDefinitionMap, answers, forEdit);
  }

  /**
   * 再掲のための文字列置換を行う
   *
   * 形式は下記の通り
   * ${<outputId>.<answer|answer_label|choice_value>}
   * 例:
   *   ${cizxhx0wb00013j5z5kq89wii.answer} => ユーザの回答データ
   *   ${cizxhx0wb00013j5z5kq89wii.answer_label} => ユーザの回答データ(radio, selectでのみ使える)
   *   ${cizxhx0wb00013j5z5kq89wii.choice_value} => Choiceの値(分岐で内部的に使用している)
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
   * ${1-1-1.answer}という表現を${cizxomo8f00033j5zz2nt9kvg.answer}という表現に置換する。
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

  /** 参照のidが含まれているかどうかをチェックする */
  containsReferenceIdIn(text) {
    return this.id2No(text) !== text;
  }

  /**
   * strに含まれる参照の文字列から、対応するOutputDefinitionを取得して配列にして返す
   */
  findReferenceOutputDefinitionsIn(str) {
    if (!this.containsReferenceIdIn(str)) return [];
    const outputDefinitions = [];
    let result = str;
    for (const key in this.id2NoParams) {
      if (!Object.prototype.hasOwnProperty.call(this.id2NoParams, key)) continue;
      const old = result;
      result = result.replace(key, this.id2NoParams[key]);
      if (result === old) continue;
      const id = this.extractIdFrom(key);
      outputDefinitions.push(this.allOutputDefinitionMap.find(od => od.getId() === id));
    }
    return outputDefinitions;
  }

  /** {{cj14nvvqj001w3k67ycbtorpn.answer}} の OutputDefinition.id であるcj14nvvqj001w3k67ycbtorpn の部分を取得する */
  extractIdFrom(str) {
    const regexp = /{{([^.]+)\./;
    const m = regexp.exec(str);
    if (m === null) throw new Error(`"${str}" は置換可能な文字列ではありません`);
    return m[1];
  }

  /** 参照している値が正しいかチェックする */
  validate(str, outputDefinitions) {
    const regexp = /{{([^.]+)\.(answer|answer_label|choice_value)}}/g;
    let m;
    for (;;) {
      m = regexp.exec(str);
      if (m === null) break;
      // 存在している参照かどうかを確かめる
      const key = `{{${m[1]}.${m[2]}}}`;
      if (!(key in this.id2ValueParams)) {
        return false;
      }
      // 渡されたoutputDefinitionの中に入っているかを確認。
      if (m[2] === 'answer' || m[2] === 'answer_label') {
        const targetOutputDefinition = outputDefinitions.find(od => od.getId() === m[1]);
        if (targetOutputDefinition === undefined) return false;
      } else if (m[2] === 'choice_value') {
      // choice_valueの場合にはchoiceから探す
        const targetChoice = outputDefinitions.flatMap(od => od.getChoices()).find(choice => choice.getId() === m[1]);
        if (targetChoice === undefined) return false;
      }
    }
    return true;
  }
}

/* eslint-env browser, jquery */
export default class SurveyManager {
  constructor(survey, setAnswerFunc) {
    this.survey = survey;
    this.setAnswerFunc = setAnswerFunc;
  }

  /**
   * 単位を付ける
   */
  unit(outputNo, str) {
    $(':no(' + outputNo + ')').after('<span class="multiNumberUnit">' + str + '</span>');
  }

  /**
   * outputNoからinputなどに設定されるnameを取得する。存在しない場合はnullを返す
   */
  getName(outputNo) {
    const outputDefinition = this.survey.getAllOutputDefinitions().find(od => od.getOutputNo() === outputNo);
    if (!outputDefinition) return null;
    return outputDefinition.getName();
  }

  /**
   * outputNoの回答値を設定する
   * 
   * 設定したいkeyだけを指定する
   * 
   * 下記のような形で使用する
   * sm.setAnswers({
   *   '1-1-1': 'abc', // outputNoの形で設問番号を指定できる
   *   'cj2v795s900063k676uz4nb1g__value1': 'def', // 直接nameの形でも指定可能
   * });
   */
  setAnswers(answers) {
    const translatedAnswers = {};
    Object.keys(answers).forEach((key) => {
      const nameKey = this.getName(key);
      if (nameKey === null) translatedAnswers[key] = answers[key];
      else translatedAnswers[nameKey] = answers[key];
    });
    this.setAnswerFunc(translatedAnswers);
  }

  /**
   * 指定したoutputNoの回答を取得する
   */
  getAnswer(outputNo) {
    return this.answers[this.getName(outputNo)];
  }


}

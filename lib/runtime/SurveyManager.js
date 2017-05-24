/* eslint-env browser, jquery */
export default class SurveyManager {
  constructor(survey, setAnswerFunc, $) {
    this.survey = survey;
    this.setAnswerFunc = setAnswerFunc;
    this.$ = $;
    
    this.init(this.$);
  }

  init($) {
    /**
     * jQuery selectors
     */
    $.extend($.expr[':'], {
      /**
       * outputNoでセレクタを指定出来るようにする。
       * @example $(':no(1-1-1)')
       **/
      no: function(elem, idx, ags) {
        var regex = new RegExp('^' + ags[3] + '$');
        return regex.test($(elem).data('output-no'));
      },

      /**
       * qidでセレクタを指定出来るようにする。
       * @example $(':qid(1-1)')
       **/
      qid: function(elem, idx, ags) {
        var regex = new RegExp('^' + ags[3] + '-.+$');
        return regex.test($(elem).data('output-no'));
      },

      /**
       * valでセレクタを指定出来るようにする。（ラジオボタン、コンボボックス）
       * @example $(':val(1)')
       **/
      val: function(elem, idx, ags) {
        var regex = new RegExp('^' + ags[3] + '$');
        return (elem.type=='radio' || elem.tagName.toLowerCase()=='select') && regex.test(elem.value);
      }
    });

    /**
     * jQuery extended functions
     */
    $.extend($.fn, {
        no: function() {
            return $(this).data('output-no');
        }
    });
  }

  /**
   * 単位を付ける
   */
  unit(outputNo, str) {
    this.$(':no(' + outputNo + ')').after('<span class="multiNumberUnit">' + str + '</span>');
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
   * surveyManager.setAnswers({
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

  getAnswer(outputNo) {
    return this.answers[this.getName(outputNo)];
  }


}

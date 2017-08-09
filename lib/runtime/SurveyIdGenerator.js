/* eslint-disable jest/no-exclusive-tests */

const SURVEY_ID_LENGTH = 3; // 文字列の長さ
const SURVEY_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 利用可能な文字

class SurveyIdGenerator {
  constructor() {
    this.existPageIds = [];
    this.existQuestionIds = [];
    this.existItemIds = [];
  }

  // Id のリストをグローバルに保持
  updateExistingIds(survey) {
    this.existPageIds = survey.getAllPageIds();
    this.existQuestionIds = survey.getAllQuestionIds();
    this.existItemIds = survey.getAllItemIds().concat(survey.getAllSubItemIds());
  }

  generatePageId() {
    const newId = this.getUniqStr(this.existPageIds);
    this.existPageIds.push(newId);
    return newId;
  }

  generateQuestionId(pageId) {
    const newId = `${pageId}_${this.getUniqStr(this.existQuestionIds, `${pageId}_`)}`;
    this.existQuestionIds.push(newId);
    return newId;
  }

  generateItemId() {
    const newId = this.getUniqStr(this.existItemIds);
    this.existItemIds.push(newId);
    return newId;
  }

  getUniqStr(exclusionIds, prefix = '') {
    let newId = null;
    while (true) {
      newId = this.generateIdStr();
      if (!exclusionIds.some(id => id === `${prefix}${newId}`)) { // eslint-disable-line no-loop-func
        return newId;
      }
    }
  }

  generateIdStr() {
    const cl = SURVEY_ID_CHARS.length;
    let str = '';
    for (let i = 0; i < SURVEY_ID_LENGTH; i++) {
      str += SURVEY_ID_CHARS[Math.floor(Math.random() * cl)];
    }
    return str;
  }
}

// Singletonのオブジェクトを生成して使う
const surveyIdGeneratorInstance = new SurveyIdGenerator();
export default surveyIdGeneratorInstance;

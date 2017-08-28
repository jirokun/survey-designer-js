/* eslint-disable jest/no-exclusive-tests */
import { List } from 'immutable';

const SURVEY_ID_LENGTH = 3; // 文字列の長さ
const SURVEY_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 利用可能な文字

export class SurveyDevIdGenerator {
  constructor() {
    this.existIds = new List();
  }

  // Id のリストを保持
  updateExistingIds(survey) {
    this.existIds = survey.getAllPageDevIds().concat(
      survey.getAllQuestionDevIds().map(devId => devId.split('_').slice(-1)[0]),
      survey.getAllItemDevIds().map(devId => devId.split('_').slice(-1)[0]),
      survey.getAllSubItemDevIds().map(devId => devId.split('_').slice(-1)[0]),
    );
    return this.existIds;
  }

  generateForPage() {
    const newId = this.getUniqStr();
    return newId;
  }

  generateForQuestion(pageDevId) {
    const newDevId = this.getUniqStr(this.existIds);
    return `${pageDevId}_${newDevId}`;
  }

  generateForItem(questionDevId) {
    const newDevId = this.getUniqStr(this.existIds);
    return `${questionDevId}_${newDevId}`;
  }

  getUniqStr() {
    let newId = null;
    while (true) {
      newId = this.generateIdStr();
      if (!this.existIds.some(id => id === newId)) { // eslint-disable-line no-loop-func
        this.existIds = this.existIds.push(newId);
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
const surveyDevIdGeneratorInstance = new SurveyDevIdGenerator();
export default surveyDevIdGeneratorInstance;

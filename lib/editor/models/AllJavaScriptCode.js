import { Record, List, Map } from 'immutable';

export const AllJavaScriptCodeRecord = Record({
  code: null,
});

/** 全JavaScript編集のデータ */
export default class AllJavaScriptCode extends AllJavaScriptCodeRecord {
  static create(survey) {
    return new AllJavaScriptCode({ code: this.getAllJavaScriptCodeFromSurvey(survey) });
  }

  static getAllJavaScriptCodeFromSurvey(survey) {
    let allCode = '';
    survey.getPages().forEach((page) => {
      const code = page.getJavaScriptCode();
      const content = code ? `${code}\n` : '';
      const pageId = page.getId();
      allCode += `${this.getStartComment(pageId)}\n${content}${this.getEndComment(pageId)}\n`;
    });
    return allCode;
  }

  static getStartComment(pageId) {
    return `// Page Start: ${pageId}`;
  }

  static getEndComment(pageId) {
    return `// Page End: ${pageId}`;
  }

  getCode() {
    return this.get('code');
  }

  /** pageId => 対応するコードを取得 */
  getCodeByPageId(pageId) {
    const startIndex = this.getCode().indexOf(AllJavaScriptCode.getStartComment(pageId));
    const endIndex = this.getCode().indexOf(AllJavaScriptCode.getEndComment(pageId));
    if (startIndex === -1 || endIndex === -1) { return null; }
    const start = startIndex + `${AllJavaScriptCode.getStartComment(pageId)}\n`.length;
    const end = endIndex - 1;
    return this.getCode().slice(start, end);
  }

  validate(survey) {
    let errors = List();
    if (!this.hasAllSeparateComment(survey)) {
      errors = errors.push('全てのページの区切りコメントがありません');
    }
    if (this.hasStringBetweenEndToStart(survey)) {
      errors = errors.push('区切り文字の終了から次の区切り文字の開始までの間に文字があります');
    }
    if (this.hasStringBeforeStart(survey)) {
      errors = errors.push('区切り文字の開始前に文字があります');
    }
    if (this.hasStringAfterEnd(survey)) {
      errors = errors.push('区切り文字の終了後に文字があります');
    }
    return errors;
  }

  /** code中にすべての区切りコメントがあるか */
  hasAllSeparateComment(survey) {
    const code = this.getCode();
    return survey.getPages().findIndex((page) => {
      const startIndex = code.indexOf(AllJavaScriptCode.getStartComment(page.getId()));
      const endIndex = code.indexOf(AllJavaScriptCode.getEndComment(page.getId()));
      return startIndex === -1 || endIndex === -1;
    }) === -1;
  }

  /** codeの終了コメント〜次の開始コメント前に文字があるか */
  hasStringBetweenEndToStart(survey) {
    const code = this.getCode();
    return survey.getPages().findIndex((page) => {
      const end = code.indexOf(AllJavaScriptCode.getEndComment(page.getId())) + `${AllJavaScriptCode.getEndComment(page.getId())}\n`.length;
      const nextNodePageId = survey.findNextPageIdFromRefId(page.getId());
      if (nextNodePageId === null) { return false; }
      const nextStart = code.indexOf(AllJavaScriptCode.getStartComment(nextNodePageId)) - 1;
      return this.getCode().slice(end, nextStart).length !== 0;
    }) !== -1;
  }

  /** 最初の開始コメントの前に文字があるか */
  hasStringBeforeStart(survey) {
    const page = survey.getPages().first();
    const start = this.getCode().indexOf(AllJavaScriptCode.getStartComment(page.getId()));
    const str = this.getCode().slice(0, start);
    return str.length !== 0;
  }

  /** 最後の終了コメントの後に文字があるか */
  hasStringAfterEnd(survey) {
    const page = survey.getPages().last();
    const end = this.getCode().indexOf(AllJavaScriptCode.getEndComment(page.getId())) + `${AllJavaScriptCode.getEndComment(page.getId())}\n`.length;
    const str = this.getCode().slice(end, -1);
    return str.length !== 0;
  }

  /** surveyの内容からcodeが変更されているか */
  isChangedCode(survey) {
    return this.getCode() !== AllJavaScriptCode.getAllJavaScriptCodeFromSurvey(survey);
  }
}

/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import AllJavaScriptCode from '../../../lib/editor/models/AllJavaScriptCode';
import baseJson from './base.json';

describe('AllJavaScriptCode', () => {
  let survey;
  beforeAll(() => {
    survey = SurveyDesignerState.createFromJson({ survey: baseJson }).getSurvey();
  });

  describe('.getAllJavaScriptCodeFromSurvey', () => {
    it('コードを取得できる', () => {
      const codeStr = AllJavaScriptCode.getAllJavaScriptCodeFromSurvey(survey);
      expect(codeStr).toBe('// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n');
    });
  });

  describe('.getStartComment', () => {
    it('ページの開始コメントを取得できる', () => {
      const pageId = 'hoge';
      const startComment = AllJavaScriptCode.getStartComment(pageId);
      expect(startComment).toBe('// Page Start: hoge');
    });
  });

  describe('.getEndComment', () => {
    it('ページの終了コメントを取得できる', () => {
      const pageId = 'hoge';
      const startComment = AllJavaScriptCode.getEndComment(pageId);
      expect(startComment).toBe('// Page End: hoge');
    });
  });

  describe('#getCode', () => {
    it('全ページのコードを取得できる', () => {
      const allJavaScriptCode = AllJavaScriptCode.create(survey);
      expect(allJavaScriptCode.getCode()).toBe('// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n');
    });
  });

  describe('#getCodeByPageId', () => {
    it('特定のページのコードを取得できる', () => {
      const allJavaScriptCode = AllJavaScriptCode.create(survey);
      expect(allJavaScriptCode.getCodeByPageId('cj1pzhzdg00023j66pvgv5plq')).toBe('code1');
      expect(allJavaScriptCode.getCodeByPageId('cj1q0g8au001s3j66v7lvbklq')).toBe('code2');
    });
  });

  describe('#hasAllSeparateComment', () => {
    it('すべてのコードが有る場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasAllSeparateComment(survey)).toBeTruthy();
    });

    it('すべてのコードがない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: hoge\ncode2\n// Page End: hoge\n' });
      expect(allJavaScriptCode.hasAllSeparateComment(survey)).toBeFalsy();
    });
  });

  describe('#hasStringBetweenEndToStart', () => {
    it('コメントの間に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasStringBetweenEndToStart(survey)).toBeFalsy();
    });

    it('コメントの間に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\nhoge// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasStringBetweenEndToStart(survey)).toBeTruthy();
    });
  });

  describe('#hasStringBeforeStart', () => {
    it('最初のコメントの前に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasStringBeforeStart(survey)).toBeFalsy();
    });

    it('最初のコメントの前に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: 'hoge// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasStringBeforeStart(survey)).toBeTruthy();
    });
  });

  describe('#hasStringAfterEnd', () => {
    it('最後のコメントの後に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.hasStringAfterEnd(survey)).toBeFalsy();
    });

    it('最後のコメントの後に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\nhoge' });
      expect(allJavaScriptCode.hasStringAfterEnd(survey)).toBeTruthy();
    });
  });

  describe('#isChangedCode', () => {
    it('変更がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\nChanged code2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.isChangedCode(survey)).toBeTruthy();
    });

    it('変更がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: cj1pzhzdg00023j66pvgv5plq\ncode1\n// Page End: cj1pzhzdg00023j66pvgv5plq\n// Page Start: cj1q0g8au001s3j66v7lvbklq\ncode2\n// Page End: cj1q0g8au001s3j66v7lvbklq\n' });
      expect(allJavaScriptCode.isChangedCode(survey)).toBeFalsy();
    });
  });
});

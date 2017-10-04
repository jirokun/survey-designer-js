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
      expect(codeStr).toBe('// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n');
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
      expect(allJavaScriptCode.getCode()).toBe('// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n');
    });
  });

  describe('#getCodeByDevId', () => {
    it('特定のページのコードを取得できる', () => {
      const allJavaScriptCode = AllJavaScriptCode.create(survey);
      expect(allJavaScriptCode.getCodeByDevId('ww1')).toBe('code1');
      expect(allJavaScriptCode.getCodeByDevId('ww2')).toBe('code2');
    });
  });

  describe('#hasAllSeparateComment', () => {
    it('すべてのコードが有る場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasAllSeparateComment(survey)).toBeTruthy();
    });

    it('すべてのコードがない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: hoge\ncode2\n// Page End: hoge\n' });
      expect(allJavaScriptCode.hasAllSeparateComment(survey)).toBeFalsy();
    });
  });

  describe('#hasStringBetweenEndToStart', () => {
    it('コメントの間に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasStringBetweenEndToStart(survey)).toBeFalsy();
    });

    it('コメントの間に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\nhoge// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasStringBetweenEndToStart(survey)).toBeTruthy();
    });
  });

  describe('#hasStringBeforeStart', () => {
    it('最初のコメントの前に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasStringBeforeStart(survey)).toBeFalsy();
    });

    it('最初のコメントの前に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: 'hoge// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasStringBeforeStart(survey)).toBeTruthy();
    });
  });

  describe('#hasStringAfterEnd', () => {
    it('最後のコメントの後に不正な文字がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.hasStringAfterEnd(survey)).toBeFalsy();
    });

    it('最後のコメントの後に不正な文字がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\nhoge' });
      expect(allJavaScriptCode.hasStringAfterEnd(survey)).toBeTruthy();
    });
  });

  describe('#isChangedCode', () => {
    it('変更がある場合 true を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\nChanged code2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.isChangedCode(survey)).toBeTruthy();
    });

    it('変更がない場合 false を返す', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\ncode1\n// Page End: ww1\n// Page Start: ww2\ncode2\n// Page End: ww2\n' });
      expect(allJavaScriptCode.isChangedCode(survey)).toBeFalsy();
    });
  });
});

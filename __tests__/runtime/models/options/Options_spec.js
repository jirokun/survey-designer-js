/* eslint-env jest */
import { List } from 'immutable';
import Option from '../../../../lib/runtime/models/options/Options';
import CssOption from '../../../../lib/runtime/models/options/CssOption';

describe('Option', () => {
  describe('getShowDetailUrl', () => {
    it('詳細プレビューのURLを取得できる', () => {
      const option = new Option({ showDetailUrl: 'http://example.com' });
      expect(option.getShowDetailUrl()).toBe('http://example.com');
    });
  });

  describe('getCssOptionIdByUrls', () => {
    it('マッチするURLがある場合、対応するcssOptionを返す', () => {
      const cssOption1 = CssOption.create('title1', List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'));
      const cssOption2 = CssOption.create('title2', List.of('g.css', 'h.css'), List.of('i.css', 'j.css'), List.of('k.css', 'l.css'));
      const cssOptions = List.of(cssOption1, cssOption2);
      const option = new Option({ cssOptions });
      expect(option.getCssOptionIdByUrls(List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'))).toBe(cssOption1.getId());
    });

    it('マッチするURLがない場合、null を返す', () => {
      const cssOption1 = CssOption.create('title1', List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'));
      const cssOption2 = CssOption.create('title2', List.of('g.css', 'h.css'), List.of('i.css', 'j.css'), List.of('k.css', 'l.css'));
      const cssOptions = List.of(cssOption1, cssOption2);
      const option = new Option({ cssOptions });
      expect(option.getCssOptionIdByUrls(List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'm.css'))).toBeNull();
    });
  });

  describe('getCssOptionById', () => {
    it('マッチするURLがある場合、対応するcssOptionを返す', () => {
      const cssOption1 = CssOption.create('title1', List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'));
      const cssOption2 = CssOption.create('title2', List.of('g.css', 'h.css'), List.of('i.css', 'j.css'), List.of('k.css', 'l.css'));
      const cssOptions = List.of(cssOption1, cssOption2);
      const option = new Option({ cssOptions });
      expect(option.getCssOptionById(cssOption1.getId())).toBe(cssOption1);
    });

    it('マッチするURLがない場合、対応するcssOptionを返す', () => {
      const cssOption1 = CssOption.create('title1', List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'));
      const cssOption2 = CssOption.create('title2', List.of('g.css', 'h.css'), List.of('i.css', 'j.css'), List.of('k.css', 'l.css'));
      const cssOptions = List.of(cssOption1, cssOption2);
      const option = new Option({ cssOptions });
      expect(option.getCssOptionById('hoge')).toBeNull();
    });
  });

  describe('hasCssOptions', () => {
    it('CssOptionが存在する場合、trueを返す', () => {
      const cssOption1 = CssOption.create('title1', List.of('a.css', 'b.css'), List.of('c.css', 'd.css'), List.of('e.css', 'f.css'));
      const cssOption2 = CssOption.create('title2', List.of('g.css', 'h.css'), List.of('i.css', 'j.css'), List.of('k.css', 'l.css'));
      const cssOptions = List.of(cssOption1, cssOption2);
      const option = new Option({ cssOptions });
      expect(option.hasCssOptions()).toBeTruthy();
    });

    it('CssOptionが存在しない場合、trueを返す', () => {
      const cssOptions = new List();
      const option = new Option({ cssOptions });
      expect(option.hasCssOptions()).toBeFalsy();
    });
  });
});

/* eslint-env jest */
import { List } from 'immutable';
import CssOption from '../../../../lib/runtime/models/options/CssOption';

describe('CssOption', () => {
  describe('matchRuntimeUrls', () => {
    it('runtimeUrlsと一致する場合はtrueを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      expect(cssOption.matchRuntimeUrls(exp)).toBeTruthy();
    });

    it('runtimeUrlsと一致しない場合はfalseを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/runtime/a.css', '/css/runtime/g.css');
      expect(cssOption.matchRuntimeUrls(exp)).toBeFalsy();
    });
  });

  describe('matchPreviewUrls', () => {
    it('runtimeUrlsと一致する場合はtrueを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/preview/c.css', '/css/preview/d.css');
      expect(cssOption.matchPreviewUrls(exp)).toBeTruthy();
    });

    it('runtimeUrlsと一致しない場合はfalseを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/preview/c.css', '/css/preview/g.css');
      expect(cssOption.matchPreviewUrls(exp)).toBeFalsy();
    });
  });

  describe('matchDetailUrls', () => {
    it('detailUrlsと一致する場合はtrueを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/detail/e.css', '/css/preview/f.css');
      expect(cssOption.matchDetailUrls(exp)).toBeTruthy();
    });

    it('detailUrlsと一致しない場合はfalseを返す', () => {
      const runtimeUrls = List.of('/css/runtime/a.css', '/css/runtime/b.css');
      const previewUrls = List.of('/css/preview/c.css', '/css/preview/d.css');
      const detailUrls = List.of('/css/detail/e.css', '/css/preview/f.css');
      const cssOption = CssOption.create('hoge', runtimeUrls, previewUrls, detailUrls);

      const exp = List.of('/css/detail/e.css', '/css/preview/g.css');
      expect(cssOption.matchDetailUrls(exp)).toBeFalsy();
    });
  });
});

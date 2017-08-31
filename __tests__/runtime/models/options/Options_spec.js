/* eslint-env jest */
import Option from '../../../../lib/runtime/models/options/Options';

describe('Option', () => {
  describe('getShowDetailUrl', () => {
    it('詳細プレビューのURLを取得できる', () => {
      const option = new Option({showDetailUrl: 'http://example.com', });
      expect(option.getShowDetailUrl(false)).toBe('http://example.com');
      expect(option.getShowDetailUrl(true)).toBe('http://example.com?env=development');
    });
  });
});

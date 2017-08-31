import { Record } from 'immutable';

export const CssUrlRecord = Record({
  title: null,
  url: null,
});

/** アンケートの定義 */
export default class CssUrlDefinition extends CssUrlRecord {
  // ------------------------- 単純なgetter -----------------------------
  getTitle() {
    return this.get('title');
  }

  getUrl() {
    return this.get('url');
  }
}

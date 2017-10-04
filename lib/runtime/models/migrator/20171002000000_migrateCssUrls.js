import { List } from 'immutable';

/**
 * CSSの定義をmigrateする
 *
 * 修正前
 * 定義が存在しない
 *
 * 修正後
 * optionのdefaultCssの値が設定される
 */
export function migrateCssUrls(survey, options) {
  if (!options) return survey;
  if (survey.getCssRuntimeUrls().size > 0 || survey.getCssPreviewUrls().size > 0) return survey;

  const defaultCss = options.getDefaultCss();

  if (!defaultCss) {
    if (!ENV.RUNTIME_CSS_URL) throw new Error('環境変数にRUNTIME_CSS_URLが設定されていません');
    if (!ENV.PREVIEW_CSS_URL) throw new Error('環境変数にPREVIEW_CSS_URLが設定されていません');
    const runtimeUrls = ENV.RUNTIME_CSS_URL.split(/,/);
    const previewUrls = ENV.PREVIEW_CSS_URL.split(/,/);
    return survey
      .set('cssRuntimeUrls', List(runtimeUrls))
      .set('cssPreviewUrls', List(previewUrls));
  }

  const runtimeUrls = defaultCss.get('runtimeUrls');
  const previewUrls = defaultCss.get('previewUrls');
  return survey
    .set('cssRuntimeUrls', List(runtimeUrls))
    .set('cssPreviewUrls', List(previewUrls));
}

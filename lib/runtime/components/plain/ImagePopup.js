/* eslint-env browser,jquery */
import $ from 'jquery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';

/**
 * 画像のポップアップ
 *
 * imgにdata-popup-urlが指定されていたが有効となる
 */
export default class ImagePopup {
  constructor(el) {
    this.el = el;
  }

  initialize() {
    this.attachPopupEvent();
    this.attachImageClickRequiredValidation();
  }

  deInitialize() {
  }

  initForDetail() {
    this.showImageDetail();
  }

  attachPopupEvent() {
    $(this.el).on('click', 'img[data-popup-url]', (e) => {
      const $targets = $('#content').find('img[data-popup-url]');
      const urls = $targets.map((i, imgEl) => ({ src: $(imgEl).data('popup-url'), w: 0, h: 0 }));
      const items = urls.toArray();
      const options = {
        history: false,
        focus: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
      };

      const container = document.getElementsByClassName('pswp')[0];
      const gallery = new PhotoSwipe(container, PhotoSwipeUIDefault, items, options);
      gallery.listen('imageLoadComplete', (index, item) => {
        const img = new Image();
        img.onload = () => {
          // itemのwidth, heightが必須なのでここで設定する
          item.w = img.width;
          item.h = img.height;
          gallery.updateSize(true);
        };
        img.src = item.src;
      });

      gallery.init();
      gallery.listen('afterChange', () => {
        const target = $(this.el).find('img[data-popup-url]').filter((i, imgEl) => {
          const src = $(imgEl).data('popup-url');
          return src === gallery.currItem.src;
        })[0];
        this.removeRelatedInputForPopupImage(target);
      });

      const clickUrl = $(e.target).data('popup-url');
      const clickedImageIndex = items.findIndex(item => item.src === clickUrl);
      gallery.goTo(clickedImageIndex);
      this.removeRelatedInputForPopupImage($targets[clickedImageIndex]);
    });
  }

  /** imgに対応するvalidation用のinputのIDを返す */
  getInputIdForPopupImage(imgEl) {
    return `${imgEl.id}-input`;
  }

  /** imgElに対応するvalidation用のinputを削除する。また、imgElにerrクラスが指定されていたら削除する */
  removeRelatedInputForPopupImage(imgEl) {
    $(imgEl).removeClass('err');
    const id = this.getInputIdForPopupImage(imgEl);
    $(`#${id}`).remove();

    // SPのエラー表示があれば消す
    if ($(imgEl).next().hasClass('formError')) {
      $(imgEl).next().remove();
    }
  }

  /** クリック必須かどうかを返す */
  isImageClickRequired($imgEl) {
    return $imgEl.data('image-click-required') === true;
  }

  /**
   * 画像のエレメントに対応するinputを生成し、parsleyのrequired属性をつける
   * 画像がクリックされたら対応するinputを削除する
   */
  attachImageClickRequiredValidation() {
    $(this.el).find('img[data-popup-url]').each((i, el) => {
      const $imgEl = $(el);
      if (!this.isImageClickRequired($imgEl)) return;

      const id = this.getInputIdForPopupImage(el);
      $(`<input type="text"
class="image-required-checkbox"
data-parsley-required="true"
id="${id}"
name="${id}"
readonly="readonly"
data-parsley-class-handler="#${el.id}"
data-parsley-required-message="クリックして詳細を確認してください"
/>`)
        .css('position', 'absolute')
        .css('left', '-1000px')
        .insertAfter(el);
    });
  }

  /**
   * 画像の詳細を表示する
   */
  showImageDetail() {
    $(this.el).find('img[data-popup-url]').each((i, imgEl) => {
      const $imgEl = $(imgEl);
      const url = $imgEl.data('popup-url');
      const clickRequired = this.isImageClickRequired($imgEl);

      if (url) {
        const image = new Image();
        image.onload = () => {
          $('<span/>').addClass('detail-function').text(`ポップアップ ${image.width}x${image.height}`).insertAfter($imgEl);
        };
        image.src = url;
      }
      if (clickRequired) $('<span/>').addClass('detail-function').text('クリック必須').insertAfter($imgEl);
    });
  }
}


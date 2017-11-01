/* eslint-env browser */
import tinymce from 'tinymce';
import S from 'string';
import cuid from 'cuid';
import '../../constants/tinymce_ja';

tinymce.PluginManager.add('image_manager', (editor) => {
  editor.addButton('image_manager', {
    text: '画像',
    icon: false,
    onclick: () => {
      const win = editor.windowManager.open({
        title: '画像管理',
        url: editor.settings.imageManagerUrl,
        width: 1000,
        height: 600,
        buttons: [{
          text: 'Close',
          onclick: 'close',
        },
        {
          text: '挿入',
          onclick: () => {
            const $iframe = win.$el.find('iframe');
            const childWindow = $iframe[0].contentWindow;
            childWindow.postMessage({ type: 'submitInsertForm' }, '*');
          },
        }],
      });

      function onMessage(e) {
        if (e.origin !== location.origin) {
          alert('オリジンが一致しません');
          return;
        }
        if (e.data.type !== 'insertImage') return;
        const { params } = JSON.parse(e.data.value);
        const image = params.image;
        const src = params.size === 'normal' ? image.imageUrl : image.thumbnailUrl;
        let html = `<img src="${src}" id="${cuid()}" `;

        if (params.clickAction === 'original') html += `class="popup" data-popup-url=${image.originalUrl} `;
        else if (params.clickAction === 'normal') html += `class="popup" data-popup-url=${image.imageUrl} `;

        const title = S(params.title);
        if (!title.isEmpty()) html += `title="${title.escapeHTML()}" `;

        const clickRequired = params.clickRequired;
        html += `data-image-click-required="${clickRequired}"/>`;
        editor.insertContent(html);
        win.close();
      }

      win.on('close', () => {
        window.removeEventListener('message', onMessage);
      });
      window.addEventListener('message', onMessage, false);
    },
  });
});

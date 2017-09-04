/* eslint-env browser */
import tinymce from 'tinymce';
import S from 'string';
import $ from 'jquery';

tinymce.PluginManager.add('field_editor', (editor) => {
  function onMenuClicked(e) {
    const { survey, runtime } = editor.settings;
    const page = runtime.findCurrentPage(survey);
    const outputDefinitions = page.getOutputDefinitions(survey);
    const outputDefinitionIdValues = outputDefinitions
      .map(od => ({ text: od.getLabelWithOutputNo(), value: od.getName() })).toArray();
    const target = e.target;
    console.log(arguments);

    // 編集フォームの表示
    editor.windowManager.open({
      title: 'フォームフィールドの編集',
      body: [
        { type: 'listbox', name: 'name', label: '対応する設問', values: outputDefinitionIdValues, value: target.name },
        { type: 'textbox', name: 'class', label: 'クラス名', value: target.className },
        { type: 'textbox', name: 'id', label: 'ID', value: target.id },
      ],
      onsubmit: (evt) => {
        const $target = $(target);
        console.log(target);
        // 要素の更新
        ['name', 'id', 'class'].forEach((key) => {
          $target.attr(key, evt.data[key]);
        });
      },
    });
  }
  editor.addMenuItem('field_editor', {
    text: 'フィールドの編集',
    context: 'input,select,textarea',
    onPostRender: (ctrl, selector) => {
      console.log(ctrl, selector);
    },
    onclick: onMenuClicked,
  });
});

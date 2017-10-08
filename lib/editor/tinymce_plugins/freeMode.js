/* eslint-env browser */
import tinymce from 'tinymce';
import '../../constants/tinymce_ja';

/**
 * フリーモードの保存とキャンセルボタンを追加する
 */
tinymce.PluginManager.add('free_mode', (editor) => {
  editor.addButton('free_mode_save', {
    text: '保存',
    icon: false,
    onclick: () => {
      editor.settings.freeModeSaveCallback();
    },
  });

  editor.addButton('free_mode_cancel', {
    text: 'キャンセル',
    icon: false,
    onclick: () => {
      editor.settings.freeModeCancelCallback();
    },
  });
});

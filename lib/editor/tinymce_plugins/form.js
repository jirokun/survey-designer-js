/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import tinymce from 'tinymce';
import S from 'string';
import FormEditor from './FormEditor';

tinymce.PluginManager.add('form_editor', (editor) => {
  editor.addButton('form_editor', {
    text: 'Form',
    icon: false,
    onclick: () => {
      function selectElement(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.ownerDocument.removeEventListener('click', selectElement, true);
        const nodeName = e.target.nodeName;
        switch (nodeName) {
          case 'INPUT':
          case 'TEXTAREA':
          case 'SELECT':
            break;
          default:
            alert('選択した要素はフォームの要素ではありません');
            return;
        }

        const { survey, runtime } = editor.settings;
        const page = runtime.findCurrentPage(survey);
        const outputDefinitions = page.getOutputDefinitions(survey);
        const outputDefinitionIdValues = outputDefinitions
          .map(od => ({ text: od.getLabelWithOutputNo(), value: od.getName() })).toArray();
        editor.windowManager.open({
          title: '対応する選択肢',
          body: [
            { type: 'listbox', name: 'outputName', label: '参照する設問', values: outputDefinitionIdValues, value: e.target.name },
            { type: 'textbox', name: 'className', label: 'クラス名', value: e.target.className },
            { type: 'textbox', name: 'id', label: 'ID', value: e.target.id },
          ],
        });
        /*
        document.body.appendChild(container);
        render(<FormEditor editor={editor} survey={survey} runtime={runtime} selectedElement={e.target} />, container);
        */
      }
      editor.contentDocument.addEventListener('click', selectElement, true);
    },
  });
});

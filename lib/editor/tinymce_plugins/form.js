/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import tinymce from 'tinymce';
import S from 'string';
import FormEditor from './FormEditor';

tinymce.PluginManager.add('form', (editor) => {
  editor.addButton('form', {
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
        const container = document.createElement('div');
        const survey = editor.settings.survey;
        const runtime = editor.settings.runtime;

        document.body.appendChild(container);
        render(<FormEditor editor={editor} survey={survey} runtime={runtime} selectedElement={e.target} />, container);
      }
      editor.contentDocument.addEventListener('click', selectElement, true);
    },
  });
});

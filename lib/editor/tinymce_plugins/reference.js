import tinymce from 'tinymce';
import S from 'string';

tinymce.PluginManager.add('reference_answer', (editor) => {
  editor.addButton('reference_answer', {
    text: '再掲',
    icon: false,
    onclick: () => {
      const survey = editor.settings.survey;
      const outputDefinitions = editor.settings.outputDefinitions;
      const outputDefinitionIdValues = outputDefinitions
        .map(od => ({ text: od.getLabelWithOutputNo(), value: od.getId() })).toArray();
      editor.windowManager.open({
        title: '再掲',
        // bodyの作り方は次のURLを参照
        // https://makina-corpus.com/blog/metier/2016/how-to-create-a-custom-dialog-in-tinymce-4
        body: [
          { type: 'listbox', name: 'outputDefinitionId', label: '参照する設問', values: outputDefinitionIdValues },
        ],
        onsubmit: (e) => {
          const id = e.data.outputDefinitionId;
          if (S(id).isEmpty()) return; // 選択されていない場合は何もしない
          const outputDefinition = outputDefinitions.find(od => od.getId() === id);
          const type = outputDefinition.getOutputType();
          if (type === 'checkbox' || outputDefinition.isOutputTypeSingleChoice()) editor.insertContent(`{{${id}.answer_label}}`);
          else editor.insertContent(`{{${id}.answer}}`);
          const replacer = survey.getReplacer();
          editor.setContent(replacer.id2No(editor.getContent()));
        },
      });
    },
  });
});
